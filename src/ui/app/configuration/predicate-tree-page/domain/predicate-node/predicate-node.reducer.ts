import { NULL_PREDICATE_NODE, PredicateNode, PredicateNodeActions, UpdatePredicateNodeAction } from './predicate-node';
import { isPredicateTemplateInfo } from './template-info-or-custom-properties';

export function predicateNodeReducer(node = NULL_PREDICATE_NODE, action: PredicateNodeActions): PredicateNode {
  switch (action.type) {
    case UpdatePredicateNodeAction.TYPE:
      if (node.nodeId !== action.nodeId) {
        return node;
      }

      let templateInfoOrCustomProperties = node.templateInfoOrCustomProperties;

      if (isPredicateTemplateInfo(templateInfoOrCustomProperties)) {
        templateInfoOrCustomProperties = {
          ...templateInfoOrCustomProperties,
          parameterValues: action.formValue.parameterValues,
        };
      } else {
        templateInfoOrCustomProperties = {
          evalFunctionBody: action.formValue.evalFunctionBody,
        };
      }

      return {
        ...node,
        name: action.formValue.nodeName,
        description: action.formValue.nodeDescription,
        templateInfoOrCustomProperties,
      };

    default:
      return node;
  }
}
