   import React from 'react';
   import { Link } from 'react-router-dom';

    function NotFoundPage() {
      return (
        <div>
          <h1>404 - Page Not Found</h1>
          <p>Esta página no existe.</p>
          <Link to="/">Ir a inicio</Link>
        </div>
      );
    }
    
export default  NotFoundPage;