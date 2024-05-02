import Form from "@rjsf/antd";
import {RJSFSchema, UiSchema} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import {ReactElement} from "react";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import {Col, Row, Space} from "antd";
import {IChangeEvent} from "@rjsf/core/src/components/Form";
import QCWidget from "./QCWidget";

// Tạo custom widget cho nút "Auto"
const AutoButtonWidget = ({ }) => {
	const handleClick = () => {
		// Đặt giá trị mặc định cho brightness
		// onChange(100); // Giả sử 100 là giá trị mặc định
		console.log("onChange");
	};

	return <>
		<Space direction={"horizontal"}>

			<button onClick={handleClick}>Auto</button>
		</Space>
	</>;
};


const CustomFieldTemplate: React.FC<any> = (props) => {
	const {id, classNames, label, help, required, description, errors, children, uiSchema} = props;

	// const uiOptions = (uiSchema && uiSchema[id]) ? uiSchema[id] : { label: false, align: true};

	let labelVisible = true;

	let align = true;

	if (id==="root_subImageBorderControl_borderXMin") {
		console.log(id);
	}
	console.log(id);

	if (id==="root") {
		labelVisible = !!uiSchema["root"]["ui:options"].label;
		align = !!uiSchema["root"]["ui:options"].align;
	} else if (uiSchema && uiSchema["ui:options"]) {
		labelVisible = !!uiSchema["ui:options"].label;
		align = !!uiSchema["ui:options"].align;
	}
	if (id=="root") {
		console.log(id);
	}
	return (
			<div className={classNames}>
				{align ? <>
							{/* Hiển thị label và input trên cùng 1 dòng */}
							<Row>
								{labelVisible
										? <>
											<Col span={12}><label htmlFor={id}>{label}{required ? '*':null}</label></Col>
											<Col span={12}>{children}</Col>
										</>:
										<Col span={24}>{children}</Col>
								}
							</Row>
						</>
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
				}
				{errors}
				{help}
			</div>
	);
};
const FormWithQC: () => ReactElement = () => {
	let workflow: RJSFSchema = {
		title: "Image Processing",
		// description: "Workflow demo form",
		type: "object",
		properties: {
			left: {
				type: "object",
				properties: {
					inputImageSet: {
						type: "string",
						title: "Input image set",
					},
					inputPolygonSet: {
						type: "string",
						title: "Input polygon set"
					},
					processImageSet: {
						type: "string",
						title: "Process image set",
						"enum": ["House", "Human", "Landscape"]
					},
					qcImageSet: {
						type: "string",
						title: "QC image set"
					},
					imageColorControl: {
						type: "object",
						title: "Image Color Control",
						// description: "Image Color Control ddddddd ddddddd ddddddd ddddddd ddddddd ",
						properties: {
							brightness: {
								type: "number",
								title: "Brightness"
							},
							// Display auto button
							autoBrightness: {
								type: "number",
							},
							contrast: {
								type: "number",
								title: "Contrast"
							}
						}
					},
					subImageBorderControl: {
						type: "object",
						title: "Sub-Image Border Control",
						// description: "Sub-Image Border Control",
						properties: {
							borderXMin: {
								type: "number",
								title: "Border x min"
							},
							borderYMin: {
								type: "number",
								title: "Border y min"
							},
							borderColor: {
								type: "number",
								title: "Border color"
							},
							borderXMax: {
								type: "number",
								title: "Border x max"
							},
							borderYMax: {
								type: "number",
								title: "Border y max"
							},
							borderThickness: {
								type: "number",
								title: "Border thickness"
							},
						}
					},
					outputImageSet: {
						type: "string",
						title: "Output image set"
					},
				}
			},
			right: {
				type: "object",
				properties: {
					qcWidget: {
						type: "string",
						title: "QCWidget"
					}
				}
			},
		}
	};
	let uiSchema: UiSchema = {
		"ui:grid": [
			{left: 16, right: 8},
		],
		root: {
			"ui:options": {
				label: true,
				align: false,
			},
		},
		left: {
			"ui:options": {
				label: false,
				col: 9
			},
			"ui:grid": [
				{inputImageSet: 12, processImageSet: 12},
				{inputPolygonSet: 12, qcImageSet: 12},
				{imageColorControl: 9, subImageBorderControl: 15
					// , qcWidget: 12
				},
				{outputImageSet: 9},
			],
			imageColorControl: {
				"ui:options": {
					label: true,
					align: false,
					col: 9
				},
				"ui:grid": [
					{brightness: 20, autoBrightness: 4},
					{contrast: 20}
				],
				autoBrightness: {
					"ui:widget": "number",
					"ui:options": {
						// Tùy chỉnh giao diện cho input number
					},
					"ui:field": AutoButtonWidget
				}
			},
			subImageBorderControl: {
				"ui:options": {label: true, align: false, col: 15, grid: true},
				"ui:grid": [
					{borderXMin: 8, borderYMin: 8, borderColor: 8},
					{borderXMax: 8, borderYMax: 8, borderThickness: 8}
				]
			},
			outputImageSet: {
				"ui:options": {label: true, align: true, col: 24, grid: true},
			},
		},
		right: {
			"ui:options": {
				label: false,
				grid: false,
				col: 15
			},
			qcWidget: {
				"ui:field": QCWidget,
				"ui:options": {label: false, align: true, col: 24}
			}
		},
	};

	const initialData = {
		"left": {
			"qcImageSet": "/img/road.jpg",
			"subImageBorderControl": {
				"borderYMin": -2,
				"borderXMax": 1
			}
		},
		right: {
			qcWidget: "/img/road.jpg"
		}
	};

	const onChange= (data: IChangeEvent, id?: string) => {
		console.log(data.formData, id);
	}
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
			/>
	);
};

export default FormWithQC;
