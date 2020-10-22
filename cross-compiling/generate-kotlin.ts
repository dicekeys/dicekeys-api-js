import * as Api from "../src/api-calls";
import * as fs from "fs";
import {
  UrlRequestMetadataParameterNames,
  UrlApiMetaCommand,
  //GetAuthTokenRequest, GetAuthTokenResponse
} from "../src/url-api"

export const generateKotlinApi = () => fs.writeFileSync("./cross-compiling-out/ApiInterfaces.kt",
`package org.dicekeys.api

class ApiStrings {

  object AndroidIntent {
    const val packageName = "org.dicekeys.trustedapp"
    const val className = "org.dicekeys.trustedapp.activities.ExecuteApiCommandActivity"
  }

  object Commands {
    ${
    Api.Commands.map( command => `const val ${command} = "${command}"`).join("\n    ")
  }
  }

  object MetaCommands {
  ${
    Object.keys(UrlApiMetaCommand).map( command => `const val ${command} = "${command}"`).join("\n    ")
  }
  }

  object Inputs {${ "\n" +
      Api.Commands.map( command =>
        `    object ${command} {` + "\n      " +
        Object.keys(Api.ParameterNames[command]).sort().map(
          parameterName => `const val ${parameterName} = "${parameterName}"`
        ).join("\n      ") + "\n    }"
      ).join("\n")
    }
  }

  object MetaInputs {
    ${
      Object.keys(Api.RequestMetadataParameterNames).sort().map(
        parameterName => `const val ${parameterName} = "${parameterName}"`
      ).join("\n    ")
    }
  }

  object UrlMetaInputs {
    ${
      Object.keys(UrlRequestMetadataParameterNames).sort().map(
        parameterName => `const val ${parameterName} = "${parameterName}"`
      ).join("\n    ")
    }
  }

  object Outputs {${ "\n" +
      Api.Commands.map( command =>
        `    object ${command} {` + "\n      " +
        Object.keys(Api.SuccessResponseParameterNames[command]).sort().map(
          parameterName => `const val ${parameterName} = "${parameterName}"`
        ).join("\n      ") + "\n    }"
      ).join("\n")
    }
  }

  object MetaOutputs {
    ${
      Object.keys(Api.ResponseMetadataParameterNames).sort().map(
        parameterName => `const val ${parameterName} = "${parameterName}"`
      ).join("\n    ")
    }
  }

  object ExceptionMetaOutputs {
    ${
      Object.keys(Api.ExceptionParameterNames).sort().map(
        parameterName => `const val ${parameterName} = "${parameterName}"`
      ).join("\n    ")
    }
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