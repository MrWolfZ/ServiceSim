import { CommandValidationConstraints, versionedRepository } from '../../../api-infrastructure';
import { CreatePredicateTemplateCommand, CreatePredicateTemplateCommandResponse, PredicateTemplateAggregate } from '../predicate-template.types';

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function createPredicateTemplate(command: CreatePredicateTemplateCommand): Promise<CreatePredicateTemplateCommandResponse> {
  const template = await repo.create(command);

  return {
    templateId: template.id,
    templateVersion: 1,
  };
}

// TODO: validate
export const createPredicateTemplateConstraints: CommandValidationConstraints<CreatePredicateTemplateCommand> = {
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};
