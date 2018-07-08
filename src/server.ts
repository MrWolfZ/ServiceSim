import errorHandler from 'errorhandler';

import host from './host';

host.use(errorHandler());

const server = host.listen(host.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    host.get('port'),
    host.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

export default server;
