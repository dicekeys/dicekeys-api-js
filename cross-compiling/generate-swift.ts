import * as Api from "../src/api-calls";
import * as fs from "fs";
import {
  UrlRequestMetadataParameterNames,
  UrlApiMetaCommand,
  //GetAuthTokenRequest, GetAuthTokenResponse
} from "../src/url-api"

export const generateSwiftApi = () => fs.writeFileSync("./cross-compiling-out/ApiInterfaces.swift",
`// Auto-generated by dicekeys-api-js/cross-compiling/generate-swift.ts
// Generated on ${new Date().toUTCString()}
import Foundation

enum ApiCommand: String, Codable, CaseIterable  {
${"\t"  +
  Api.Commands.map( command => `case ${command}`).join("\n\t")
}
}

enum ApiMetaCommand: String, Codable, CaseIterable {
${
  Object.keys(UrlApiMetaCommand).map( command => `    case ${command}`).join("\n\t")
}
}

enum Request {${ "\n" +
    Api.Commands.map( command =>
      `    case ${command}(` + 
      Object.keys(Api.ParameterNames[command]).sort().map(
        parameterName => `${parameterName}: ${parameterName.indexOf("Json") >= 0 || parameterName == "UnsealingInstructions" || parameterName.indexOf("recipe") >= 0 ? "String" : "Data"}`
      ).join(", ")
    ).join(")\n")
  })
}

enum MetaInputs: String, Codable, CaseIterable {
${"\t"  +
    Object.keys(Api.RequestMetadataParameterNames).sort().map(
      parameterName => `case ${parameterName}`
    ).join("\n\t")
  }
}

enum UrlMetaInputs: String, Codable {
${"\t"  +
    Object.keys(UrlRequestMetadataParameterNames).sort().map(
      parameterName => `case ${parameterName}`
    ).join("\n\t")
  }
}

enum SuccessResponse {${ "\n" +
    Api.Commands.map( command =>
      `    case ${command}(` +
      Object.keys(Api.SuccessResponseParameterNames[command]).sort().map(
        parameterName => `${parameterName}: ${parameterName.endsWith("Json") ? "String" : "Data"}`
      ).join(", ")
    ).join(")\n")
  })
}

enum MetaOutput: String, Codable, CaseIterable {
${"\t"  +
    Object.keys(Api.ResponseMetadataParameterNames).sort().map(
      parameterName => `case ${parameterName}`
    ).join("\n\t")
  }
}

enum ExceptionMetaOutput: String, Codable, CaseIterable {
${"\t"  +
    Object.keys(Api.ExceptionParameterNames).sort().map(
      parameterName => `case ${parameterName}`
    ).join("\n\t")
  }
}
`);

/*

${
  Api.Commands.map( command => `  object ${command}Inputs = [` +
    Object.keys(Api.ParameterNames[command]).sort().map(
      parameterName => `"${parameterName}"`
    ).join(", ") + "]"
  ).join("\n")
}

${
  Api.Commands.map( command => `  object ${command}Outputs = [` +
      (Api.SuccessResponseParameters[command].sort() as string[]).map(
        parameterName => `"${parameterName}"`
      ).join(", ") + "]"
  ).join("\n")
}

*/