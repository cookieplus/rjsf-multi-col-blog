import Form from "@rjsf/antd";
import {RegistryWidgetsType, RJSFSchema, UiSchema} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import {Col, Collapse, Row, Space} from "antd";
import {IChangeEvent} from "@rjsf/core/src/components/Form";
import {ChangeEvent, FormEvent} from "react";


// Tạo custom widget cho nút "Auto"
const AutoButtonWidget:React.FC<any> = (props) => {
	const triggerName = props.options.triggerName;

	// Gọi function trigger khi button được nhấp
	const handleClick = () => {
		console.log("AutoButtonWidget clicked", triggerName);
		if (props.options.trigger) {
			props.options.trigger(triggerName);
		}
	};

	return <>
		<Space direction={"horizontal"}>

			<button onClick={handleClick}>Auto</button>
		</Space>
	</>;
};


const CustomFieldTemplate: React.FC<any> = (props) => {
	const {id, classNames, label, help, required, description, errors, children, uiSchema} = props;

	// Default label is visible and align with field.
	let labelVisible = true;
	let align = true;
	let labelColspan = 12;
	let isAccordion = false;

	// if (id==="root_subImageBorderControl_borderXMin") {
	// 	console.log(id);
	// }
	// console.log(id);


	let uiOptions: any = {};

	if (id==="root") {
		if (uiSchema && uiSchema["root"] && uiSchema["root"]["ui:options"])
			uiOptions = uiSchema["root"]["ui:options"];
	} else {
		if (uiSchema && uiSchema["ui:options"])
			uiOptions = uiSchema["ui:options"];
	}

	if (uiOptions.hasOwnProperty("label"))
		labelVisible = uiOptions.label;
	if (uiOptions.hasOwnProperty("align"))
		align = uiOptions.align;
	if (uiOptions.hasOwnProperty("col"))
		labelColspan = uiOptions.col;
	if (uiOptions.hasOwnProperty("accordion")) {
		isAccordion = uiOptions.accordion;
	}
	// if (id==="root") {
	// 	labelVisible = !!uiSchema["root"]["ui:options"].label;
	// 	align = !!uiSchema["root"]["ui:options"].align;
	// 	if (!!uiSchema["root"]["ui:options"].col)
	// 		labelColspan = uiSchema["root"]["ui:options"].col;
	//
	// 	if (!!uiSchema["root"]["ui:options"].accordion)
	// 		isAccordion = uiSchema["root"]["ui:options"].accordion;
	// } else if (uiSchema && uiSchema["ui:options"]) {
	// 	labelVisible = !!uiSchema["ui:options"].label;
	// 	align = !!uiSchema["ui:options"].align;
	// 	if (!!uiSchema["ui:options"].col)
	// 		labelColspan = uiSchema["ui:options"].col;
	// 	if (!!uiSchema["ui:options"].accordion)
	// 		isAccordion = uiSchema["ui:options"].accordion;
	// }
	if (id=="root") {
		console.log(id);
	}

	const items = [
		{
			key: '1',
			label: <label htmlFor={id}>{label}{required ? '*':null}</label>,
			children: <Col span={24}>{children}</Col>,
		},
	];

	return (
			<div className={classNames}>
				{align ? <>
							{/* Hiển thị label và input trên cùng 1 dòng */}
							<Row>
								{labelVisible
										? <>
											<Col span={labelColspan}><label htmlFor={id}>{label}{required ? '*':null}</label></Col>
											<Col span={24-labelColspan}>{children}</Col>
										</>:
										<Col span={24}>{children}</Col>
								}
							</Row>
						</>
						//  not align
						// :<>
						// 	<Collapse items={items} defaultActiveKey={['1']} />
						// </>
						: (isAccordion ? <Collapse items={items} defaultActiveKey={[id]} />
						:<>
							{/* Hiển thị label và input trên các dòng khác nhau */}
							{labelVisible ?
									<Row>
										<Col span={24}>{label}{required ? '*':null}</Col>
									</Row>
									:<></>
							}
							<Row>
								<Col span={24}>{children}</Col>
							</Row>
						</>
						)
				}
				{errors}
				{help}
			</div>
	);
};

interface CustomObjectWidgetProps {
	value: any;
	onChange: (value: any) => void;
}

const TrainTrackImageWidget: React.FC<CustomObjectWidgetProps> = ({ value, onChange }) => {
	console.log("TrainTrackImageWidget", value);

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		try {
			const newValue = JSON.parse(event.target.value);
			onChange(newValue);
		} catch (error) {
			console.error("Invalid JSON", error);
		}
	};

	return (
			<textarea
					value={JSON.stringify(value, null, 2)}
					onChange={handleChange}
					style={{ width: '100%', height: '100px' }}
			/>
	);
};
const generateData = (json: any, isRoot: boolean = false): any => {
	const schema: any = {};
	let uiSchema: any = false;

	if (json.hasOwnProperty('uiSchema')) {
		uiSchema = json.uiSchema;
	}
	// { type, properties, uiScheme,... }
	for (const [key, value] of Object.entries(json)) {
		if (key === 'properties') {
			schema[key] = {};
			// { property: value }
			for (const [p, val] of Object.entries(value as any)) {
				const o: any = generateData(val);
				schema[key][p] = o.schema;
				if (o.uiSchema) {
					if (!uiSchema) {
						uiSchema = { [p]: o.uiSchema };
					} else {
						uiSchema[p] = o.uiSchema;
					}
				}
			}
		}
		else if (key !== 'uiSchema') {
			schema[key] = value;
		}
	}

	if (isRoot && uiSchema['ui:options']) {
		const options = JSON.parse(JSON.stringify(uiSchema['ui:options']));
		uiSchema.root = { 'ui:options': options };
		delete uiSchema['ui:options'];
	}

	return { schema, uiSchema };
}

export interface WorkflowFormProps {
	params: any;
	data?: any;
}
const WorkflowForm: React.FC<WorkflowFormProps> = ({ params, data }) =>  {
	// const o = generateData(params.parameters, true);
	// console.log(params.id, "schema", o.schema, "uiSchema", o.uiSchema);

	// let formData = {};
	// if (params.id == "form2") {
	// 	formData = {
	// 		qcSection: {
	// 			trainTrackImage: {name: "abc", image: "xyz"},
	// 			processingWindowLimit: "1000"
	// 		}
	// 	}
	// }

	let workflow: RJSFSchema = params.schema;
	let uiSchema: UiSchema = params.uiSchema;

	const onChange= (data: IChangeEvent, id?: string) => {
		console.log(data.formData, id);
	}

	const trigger = (triggerName: string) => {
		console.log(`Button with triggerName ${triggerName} was clicked.`);
	};

	const onSubmit = (data: IChangeEvent, event: FormEvent<any>) => {
		console.log('Data submitted: ', <data className="formData"></data>);
	}

	const customWidgets: RegistryWidgetsType = {
		autoButton: AutoButtonWidget
	};
	return (
			<Form
					schema={workflow}
					// schema={_RJSFSchema}
					validator={validator}
					templates={{
						ObjectFieldTemplate: ObjectFieldTemplate,
						FieldTemplate: CustomFieldTemplate,
						// BaseInputTemplate: CustomBaseInputTemplate2
					}}
					uiSchema={uiSchema}
					onChange={onChange}
					widgets={customWidgets}

					formContext={trigger}
					// formData={formData}
					formData={data.formData || {}}
					onSubmit={onSubmit}
			/>
	);
};

export default WorkflowForm;
