import Form from "@rjsf/antd";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { ReactElement } from "react";
import schema from "./FormSchema.json";
import ObjectFieldTemplate from "./ObjectFieldTemplate";

let _RJSFSchema: RJSFSchema = JSON.parse(JSON.stringify(schema));

const BasicForm: () => ReactElement = () => {
  return (
    <Form
      schema={_RJSFSchema}
      validator={validator}
      templates={{
        ObjectFieldTemplate: ObjectFieldTemplate,
      }}
      uiSchema={{
        "ui:grid": [
          { firstName: 12, lastName: 12 },
          { age: 6, bio: 18 },
          {password: 12, telephone: 12}
        ],
      }}
    />
  );
};

export default BasicForm;
