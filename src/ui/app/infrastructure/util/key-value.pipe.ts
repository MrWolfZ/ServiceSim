import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValue',
})
export class KeyValuePipe implements PipeTransform {
  transform(value: any, _: string[]): any {
    return Object.keys(value).map(key => ({ key, value: value[key] }));
  }
}
