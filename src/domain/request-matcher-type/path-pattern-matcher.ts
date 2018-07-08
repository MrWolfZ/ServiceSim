import { Request } from '../request/request';
import { RequestMatcherType } from './request-matcher-type';

export const KIND = 'request-matcher-type/PATH_PATTERN';

export const PATH_PATTERN_TYPE: RequestMatcherType = {
  name: 'path-pattern',
  description: '',
  propertyDescriptors: [
    {
      name: 'pattern',
      description: '',
      isRequired: true,
      valueType: 'string',
    },
  ],
};

export function apply(request: Request, props: any) {
  return true;
}
