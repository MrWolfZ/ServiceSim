// tslint:disable
// @ts-ignore
// taken https://gist.github.com/jed/982883
function b(a?: any){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}

// this mechanism allows returning a deterministic ID during testing
let oneTimeGuid: string | undefined = undefined;

export function setOneTimeGuid(value: string) {
  oneTimeGuid = value;
}

export function guid() {
  if (oneTimeGuid) {
    const result = oneTimeGuid;
    oneTimeGuid = undefined;
    return result;
  }

  return b();
}
