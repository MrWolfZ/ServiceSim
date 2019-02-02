import { getPredicateTemplatesByIdsAndVersions } from 'src/application/predicate-template/queries/get-predicate-templates-by-ids-and-versions';
import { getResponseGeneratorTemplatesByIdsAndVersions } from '../../response-generator-template/response-generator-template.api';
import { predicateNodeRepo } from '../predicate-node.repo';
import { PredicateNodeDto, ResponseGeneratorData, ResponseGeneratorDataWithTemplateSnapshot, TemplateInfo } from '../predicate-node.types';

export async function getAllPredicateNodes() {
  const allNodes = await predicateNodeRepo.query.all();

  function getReferencedTemplateIdsAndVersions(templateInfos: TemplateInfo[]) {
    return templateInfos.reduce((agg, ti) => {
      agg[ti.templateId] = agg[ti.templateId] || [];

      if (!agg[ti.templateId].includes(ti.templateVersion)) {
        agg[ti.templateId].push(ti.templateVersion);
      }

      return agg;
    }, {} as { [templateId: string]: number[] });
  }

  const allReferencedPredicateTemplateIdsAndVersions = getReferencedTemplateIdsAndVersions(
    allNodes
      .filter(n => typeof n.templateInfoOrEvalFunctionBody !== 'string')
      .map(n => n.templateInfoOrEvalFunctionBody as TemplateInfo)
  );

  const allReferencedResponseGeneratorTemplateIdsAndVersions = getReferencedTemplateIdsAndVersions(
    allNodes
      .filter(n => !Array.isArray(n.childNodeIdsOrResponseGenerator) && typeof n.templateInfoOrEvalFunctionBody !== 'string')
      .map(n => (n.childNodeIdsOrResponseGenerator as ResponseGeneratorData).templateInfoOrGeneratorFunctionBody as TemplateInfo)
  );

  const [
    allReferencedPredicateTemplates,
    allReferencedResponseGeneratorTemplates,
  ] = await Promise.all([
    getPredicateTemplatesByIdsAndVersions({ idsAndVersions: allReferencedPredicateTemplateIdsAndVersions }),
    getResponseGeneratorTemplatesByIdsAndVersions(allReferencedResponseGeneratorTemplateIdsAndVersions),
  ]);

  return allNodes.map<PredicateNodeDto>(n => {
    let templateInfoOrEvalFunctionBody: PredicateNodeDto['templateInfoOrEvalFunctionBody'];

    if (typeof n.templateInfoOrEvalFunctionBody === 'string') {
      templateInfoOrEvalFunctionBody = n.templateInfoOrEvalFunctionBody;
    } else {
      const templateId = n.templateInfoOrEvalFunctionBody.templateId;
      const templateVersion = n.templateInfoOrEvalFunctionBody.templateVersion;
      const template = allReferencedPredicateTemplates.find(t => t.id === templateId && t.version === templateVersion)!;

      templateInfoOrEvalFunctionBody = {
        templateId,
        templateVersion,
        parameterValues: n.templateInfoOrEvalFunctionBody.parameterValues,
        templateDataSnapshot: {
          name: template.name,
          description: template.description,
          evalFunctionBody: template.evalFunctionBody,
          parameters: template.parameters,
        },
      };
    }

    let childNodeIdsOrResponseGenerator: PredicateNodeDto['childNodeIdsOrResponseGenerator'];

    if (Array.isArray(n.childNodeIdsOrResponseGenerator)) {
      childNodeIdsOrResponseGenerator = n.childNodeIdsOrResponseGenerator;
    } else {
      let templateInfoOrGeneratorFunctionBody: ResponseGeneratorDataWithTemplateSnapshot['templateInfoOrGeneratorFunctionBody'];

      if (typeof n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody === 'string') {
        templateInfoOrGeneratorFunctionBody = n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody;
      } else {
        const templateId = n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.templateId;
        const templateVersion = n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.templateVersion;
        const template = allReferencedResponseGeneratorTemplates.find(t => t.id === templateId && t.version === templateVersion)!;

        templateInfoOrGeneratorFunctionBody = {
          templateId,
          templateVersion,
          parameterValues: n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.parameterValues,
          templateDataSnapshot: {
            name: template.name,
            description: template.description,
            generatorFunctionBody: template.generatorFunctionBody,
            parameters: template.parameters,
          },
        };
      }

      childNodeIdsOrResponseGenerator = {
        name: n.childNodeIdsOrResponseGenerator.name,
        description: n.childNodeIdsOrResponseGenerator.description,
        templateInfoOrGeneratorFunctionBody,
      };
    }

    return {
      id: n.id,
      version: n.$metadata.version,
      name: n.name,
      description: n.description,
      templateInfoOrEvalFunctionBody,
      childNodeIdsOrResponseGenerator,
    };
  });
}
