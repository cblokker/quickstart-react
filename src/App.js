import React from "react";
import "./App.css";
import FormComponent from "./components/FormComponent/FormComponent";
import "monday-ui-react-core/dist/main.css";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient()

const App = () => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient} contextSharing={true}></QueryClientProvider>
        <FormComponent />
      </QueryClientProvider>
    </div>
  );
};

export default App;
