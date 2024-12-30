import { JSX } from 'react';
import { Auth } from './auth/Auth';
import '@aws-amplify/ui-react/styles.css';

function App(): JSX.Element {

  return (
    <main>
      <Auth />
    </main>
  );
}

export default App;
