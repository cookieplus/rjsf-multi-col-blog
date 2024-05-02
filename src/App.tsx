import BasicForm from "./components/BasicForm";
import "./App.css"
import WorkflowForm from "./components/WorkflowForm";
import { AndroidOutlined, AppleOutlined, LinuxOutlined } from '@ant-design/icons';

import * as w1 from './components/w/w1.json';
import * as w2 from './components/w/w2.json';
import * as w3 from './components/w/w3.json';

import * as p1 from './components/w/p1.json';
import * as p2 from './components/w/p2.json';
import * as p3 from './components/w/p3.json';

import {Tabs} from "antd";

function App() {

	return (
			<div className="App">
				{/*<h1>WorkflowForm1</h1>*/}

				{/*<h1>WorkflowForm2</h1>*/}

				{/*<h1>WorkflowForm3</h1>*/}


				{/*<hr/>*/}
				{/*<FormWithQC/>*/}
				{/*<hr/>*/}
				{/*<BasicForm/>*/}

				<Tabs
						defaultActiveKey="1"
						items={[
							{
								label: 'Flow 1',
								key: '1',
								children: <WorkflowForm params={w1} data={p1} />,
								icon: <AppleOutlined />
							},
							{
								label: 'Flow 2',
								key: '2',
								children: <WorkflowForm params={w2} data={p2}/>,
								disabled: false,
								icon: <AndroidOutlined />
							},
							{
								label: 'Flow 3',
								key: '3',
								children: <WorkflowForm params={w3} data={p3}/>,
								icon: <LinuxOutlined />
							},
						]}
				/>
			</div>
	);
}

export default App;
