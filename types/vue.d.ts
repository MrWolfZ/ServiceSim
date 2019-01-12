declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

// tslint:disable-next-line:no-namespace
declare namespace NodeJS {
  interface Process {
    cwd(): string;
  }
}
