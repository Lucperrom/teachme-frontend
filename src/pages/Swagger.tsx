import { useParams } from "react-router-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerDocs() {
  const { service } = useParams<{ service: string }>();
  return <SwaggerUI url={`/swagger/${service}/api-docs`} />;
}
