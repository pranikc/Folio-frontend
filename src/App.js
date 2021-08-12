import logo from './logo.svg';
import './App.css';
import Header from "./Header";
import "antd/dist/antd.css";
import { Layout } from "antd";

const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header />
        Premium Portfolio Manager
    </Layout>
  );
}

export default App;
