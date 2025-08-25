import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import { JSON } = "mo:serde";

import GlobalConstants "../constants/Global";
import GeminiContants "../constants/Gemini";

import HttpTypes "../types/HttpTypes";
import HttpHelper "../helpers/HttpHelper";

import GeminiTypes "../types/GeminiTypes";
import ResumeExtractTypes "../types/ResumeExtractTypes";

module GeminiServices {
  public func AnalyzeResume(resumeContent : Text, jobTitle : Text) : async ?GeminiTypes.AnalyzeStructureResponse {
    let route : Text = "/analyze/gemini-service";
    // let route : Text = "/gemini-mockup";

    // Construct Request Body
    let body : GeminiTypes.AnalyzeResumeRequest = {
      cvContent = resumeContent;
      jobTitle = jobTitle;
    };

    let bodyKeys = ["cvContent", "jobTitle"];
    let blobBody = to_candid (body);

    switch (JSON.toText(blobBody, bodyKeys, null)) {
      case (#err(error)) {
        Debug.print("Error occured when create request body" # error);
        null;
      };
      case (#ok(jsonBody)) {

        // Debug json body
        Debug.print(debug_show (jsonBody));

        let bodyAsBlob = Text.encodeUtf8(jsonBody);

        // Construct HttpRequest Data
        let request : HttpTypes.HttpRequest = {
          url = GlobalConstants.API_BASE_URL # route;
          max_response_bytes = null;
          header_host = GlobalConstants.API_HOST;
          header_user_agent = GeminiContants.GEMINI_USER_AGENT;
          header_content_type = GlobalConstants.API_CONTENT_TYPE;
          body = ?bodyAsBlob;
          method = #post;
        };

        let result : HttpTypes.HttpResponse = await HttpHelper.sendPostHttpRequest(request);

        // Decode Body Response
        let decodedText : ?Text = switch (Text.decodeUtf8(result.body)) {
          case (null) { null };
          case (?y) { ?y };
        };

        switch (decodedText) {
          case (null) {
            Debug.print("Data item is null");
            null;
          };
          case (?text) {
            Debug.print(debug_show (text));
            switch (JSON.fromText(text, null)) {
              case (#ok(blob)) {
                let geminiResponse : ?GeminiTypes.AnalyzeStructureResponse = from_candid (blob);
                Debug.print(debug_show (geminiResponse));

                geminiResponse;
              };
              case (#err(error)) {
                Debug.print(debug_show (error));
                null;
              };
            };
          };
        };
      };
    };
  };

  //   public func Extract(resumeContent : Text) : async ?ResumeExtractTypes.ResumeDataInput {
  //     let route : Text = "/gemini-extract";

  //     let body : ResumeExtractTypes.ResumeExtractRequest = {
  //       cvContent = resumeContent;
  //     };

  //     let bodyKeys = ["cvContent"];
  //     let blobBody = to_candid (body);

  //     switch (JSON.toText(blobBody, bodyKeys, null)) {
  //       case (#err(error)) {
  //         Debug.print("Error creating request body: " # error);
  //         null;
  //       };
  //       case (#ok(jsonBody)) {
  //         Debug.print("ResumeExtract Request JSON: " # jsonBody);

  //         let bodyAsBlob = Text.encodeUtf8(jsonBody);

  //         let request : HttpTypes.HttpRequest = {
  //           url = GlobalConstants.API_BASE_URL # route;
  //           max_response_bytes = null;
  //           header_host = GlobalConstants.API_HOST;
  //           header_user_agent = "resume-extract-client";
  //           header_content_type = GlobalConstants.API_CONTENT_TYPE;
  //           body = ?bodyAsBlob;
  //           method = #post;
  //         };

  //         let result : HttpTypes.HttpResponse = await HttpHelper.sendPostHttpRequest(request);

  //         let decodedText : ?Text = switch (Text.decodeUtf8(result.body)) {
  //           case null { null };
  //           case (?y) { ?y };
  //         };

  //         switch (decodedText) {
  //           case null {
  //             Debug.print("ResumeExtract: Empty response");
  //             null;
  //           };
  //           case (?text) {
  //             Debug.print("ResumeExtract Response: " # text);
  //             switch (JSON.fromText(text, null)) {
  //               case (#ok(blob)) {
  //                 let resumeData : ?ResumeExtractTypes.ResumeDataInput = from_candid (blob);
  //                 Debug.print("resumeData return" # debug_show (resumeData));

  //                 resumeData;

  //               };
  //               case (#err(error)) {
  //                 Debug.print("ResumeExtract JSON parse error: " # error);
  //                 null;
  //               };
  //             };
  //           };
  //         };
  //       };
  //     };
  //   };

  //   public func ExtractMock(resumeContent : Text) : async ?ResumeExtractTypes.ResumeDataInput {
  //     Debug.print("ResumeExtractMock Request Content: " # resumeContent);

  //     let resumeData : ResumeExtractTypes.ResumeDataInput = {
  //       summary = {
  //         content = "Results-driven Informatics graduate with a strong interest in Business Improvement Analysis. Experienced in optimizing workflows, automating processes, and implementing innovative digital solutions across multiple industries. Skilled in data analysis, system integration, project management, and cross-functional collaboration to deliver sustainable business growth.";
  //       };
  //       workExperiences = [
  //         {
  //           company = "Pharos Group";
  //           location = "Jakarta, Indonesia";
  //           position = "Business Process Excellence";
  //           employment_type = ?"Full-time";
  //           period = {
  //             start = { year = 2023; month = 1 };
  //             end = { year = 2024; month = 6 };
  //           };
  //           responsibilities = [
  //             "Led the development of an integrated Change Control Phase 2 by aligning workflows with the Registration module, adding notification features, optimizing form structures, and providing real-time monitoring dashboards.",
  //             "Spearheaded the full digitization of the CAPA (Corrective and Preventive Action) process, streamlining root cause analysis and preventive action implementation across entities.",
  //             "Created comprehensive documentation including BRD, PRD, traceability matrix, and user requirements to ensure structured, scalable system implementation.",
  //           ];
  //         },
  //         {
  //           company = "Sari Tirta Group (Subholding Melawai Group)";
  //           location = "Jakarta, Indonesia";
  //           position = "IT - Business Process Improvement";
  //           employment_type = ?"Full-time";
  //           period = {
  //             start = { year = 2022; month = 4 };
  //             end = { year = 2022; month = 12 };
  //           };
  //           responsibilities = [
  //             "Streamlined business workflows, automated processes, and optimized user account management to improve operational efficiency.",
  //             "Led system integration, user training, and data migration for a new outsourcing company, managing data for 500+ employees.",
  //             "Developed an AppSheet application to simplify the talent request process, reducing response time by 30%.",
  //           ];
  //         },
  //         {
  //           company = "Bangkit Academy by Google, GoTo and Traveloka";
  //           location = "Jakarta, Indonesia";
  //           position = "Mobile Developer & Cloud Computing";
  //           employment_type = ?"Internship";
  //           period = {
  //             start = { year = 2021; month = 8 };
  //             end = { year = 2021; month = 12 };
  //           };
  //           responsibilities = [
  //             "Developed and maintained mobile applications using Flutter and Kotlin, ensuring smooth performance and responsive UI/UX.",
  //             "Collaborated with cross-functional teams to design, build, and deploy user-friendly mobile apps using Figma.",
  //             "Designed, implemented, and managed cloud infrastructure on Google Cloud Platform, ensuring security and compliance.",
  //             "Applied agile methodologies for mobile and cloud-based solutions in Capstone projects.",
  //           ];
  //         },
  //         {
  //           company = "HKBP Taman Mini";
  //           location = "Jakarta, Indonesia";
  //           position = "IT Support";
  //           employment_type = ?"Part-time";
  //           period = {
  //             start = { year = 2020; month = 3 };
  //             end = { year = 2020; month = 12 };
  //           };
  //           responsibilities = [
  //             "Provided technical support for livestreaming events, including audio, video, and lighting setup.",
  //             "Managed livestreaming platforms such as YouTube, Zoom, and OBS for high-quality broadcasts.",
  //             "Edited videos and images using Adobe Premiere Pro, Illustrator, Photoshop, and Canva.",
  //           ];
  //         },
  //       ];
  //       educations = [
  //         {
  //           institution = "University of Indonesia";
  //           degree = "Bachelor of Science in Informatics";
  //           study_period = {
  //             start = { year = 2018; month = 8 };
  //             end = { year = 2022; month = 7 };
  //           };
  //           score = "3.75 / 4.00";
  //           description = "Specialized in Business Process Optimization, Software Development, and Data Analysis. Completed a final-year project on AI-powered workflow automation.";
  //         },
  //         {
  //           institution = "Jakarta State Senior High School 1";
  //           degree = "Science Major";
  //           study_period = {
  //             start = { year = 2015; month = 7 };
  //             end = { year = 2018; month = 5 };
  //           };
  //           score = "91.25 / 100";
  //           description = "Focused on mathematics, physics, and computer science.";
  //         },
  //       ];
  //     };

  //     Debug.print("resumeData mock return " # debug_show (resumeData));
  //     return ?resumeData;
  //   };
  public func Extract(resumeContent : Text) : async ?ResumeExtractTypes.ResumeDataInput {
    let route : Text = "/gemini-extract";

    let body : ResumeExtractTypes.ResumeExtractRequest = {
      cvContent = resumeContent;
    };

    let bodyKeys = ["cvContent"];
    let blobBody = to_candid (body);

    switch (JSON.toText(blobBody, bodyKeys, null)) {
      case (#err(error)) {
        Debug.print("Error creating request body: " # error);
        null;
      };
      case (#ok(jsonBody)) {
        Debug.print("ResumeExtract Request JSON: " # jsonBody);

        let bodyAsBlob = Text.encodeUtf8(jsonBody);

        let request : HttpTypes.HttpRequest = {
          url = GlobalConstants.API_BASE_URL # route;
          max_response_bytes = null;
          header_host = GlobalConstants.API_HOST;
          header_user_agent = "resume-extract-client";
          header_content_type = GlobalConstants.API_CONTENT_TYPE;
          body = ?bodyAsBlob;
          method = #post;
        };

        let result : HttpTypes.HttpResponse = await HttpHelper.sendPostHttpRequest(request);

        let decodedText : ?Text = switch (Text.decodeUtf8(result.body)) {
          case null { null };
          case (?y) { ?y };
        };

        switch (decodedText) {
          case null {
            Debug.print("ResumeExtract: Empty response");
            null;
          };
          case (?text) {
            Debug.print("ResumeExtract Response: " # text);
            switch (JSON.fromText(text, null)) {
              case (#ok(blob)) {
                let resumeData : ?ResumeExtractTypes.ResumeDataInput = from_candid (blob);
                Debug.print("resumeData return" # debug_show (resumeData));

                resumeData;

              };
              case (#err(error)) {
                Debug.print("ResumeExtract JSON parse error: " # error);
                null;
              };
            };
          };
        };
      };
    };
  };

  // public func ExtractMock(resumeContent : Text) : async ?ResumeExtractTypes.ResumeDataInput {
  //   Debug.print("ResumeExtractMock Request Content: " # resumeContent);

  //   let resumeData : ResumeExtractTypes.ResumeDataInput = {
  //     summary = {
  //       content = "Results-driven Informatics graduate with a strong interest in Business Improvement Analysis. Experienced in optimizing workflows, automating processes, and implementing innovative digital solutions across multiple industries. Skilled in data analysis, system integration, project management, and cross-functional collaboration to deliver sustainable business growth.";
  //     };
  //     workExperiences = [
  //       {
  //         company = "Pharos Group";
  //         location = "Jakarta, Indonesia";
  //         position = "Business Process Excellence";
  //         employment_type = ?"Full-time";
  //         period = {
  //           start = ?"2023-01";
  //           end = ?"2024-06";
  //         };
  //         description = "Led the development of an integrated Change Control Phase 2 by aligning workflows with the Registration module, adding notification features, optimizing form structures, and providing real-time monitoring dashboards. Spearheaded the full digitization of the CAPA (Corrective and Preventive Action) process, streamlining root cause analysis and preventive action implementation across entities. Created comprehensive documentation including BRD, PRD, traceability matrix, and user requirements to ensure structured, scalable system implementation.";
  //       },
  //       {
  //         company = "Sari Tirta Group (Subholding Melawai Group)";
  //         location = "Jakarta, Indonesia";
  //         position = "IT - Business Process Improvement";
  //         employment_type = ?"Full-time";
  //         period = {
  //           start = ?"2022-04";
  //           end = ?"2022-12";
  //         };
  //         description = "Streamlined business workflows, automated processes, and optimized user account management to improve operational efficiency. Led system integration, user training, and data migration for a new outsourcing company, managing data for 500+ employees. Developed an AppSheet application to simplify the talent request process, reducing response time by 30%.";
  //       },
  //       {
  //         company = "Bangkit Academy by Google, GoTo and Traveloka";
  //         location = "Jakarta, Indonesia";
  //         position = "Mobile Developer & Cloud Computing";
  //         employment_type = ?"Internship";
  //         period = {
  //           start = ?"2021-08";
  //           end = ?"2021-12";
  //         };
  //         description = "Developed and maintained mobile applications using Flutter and Kotlin, ensuring smooth performance and responsive UI/UX. Collaborated with cross-functional teams to design, build, and deploy user-friendly mobile apps using Figma. Designed, implemented, and managed cloud infrastructure on Google Cloud Platform, ensuring security and compliance. Applied agile methodologies for mobile and cloud-based solutions in Capstone projects.";
  //       },
  //       {
  //         company = "HKBP Taman Mini";
  //         location = "Jakarta, Indonesia";
  //         position = "IT Support";
  //         employment_type = ?"Part-time";
  //         period = {
  //           start = ?"2020-03";
  //           end = ?"2020-12";
  //         };
  //         description = "Provided technical support for livestreaming events, including audio, video, and lighting setup. Managed livestreaming platforms such as YouTube, Zoom, and OBS for high-quality broadcasts. Edited videos and images using Adobe Premiere Pro, Illustrator, Photoshop, and Canva.";
  //       },
  //     ];
  //     educations = [
  //       {
  //         institution = "University of Indonesia";
  //         degree = "Bachelor of Science in Informatics";
  //         period = {
  //           start = ?"2018-08";
  //           end = ?"2022-07";
  //         };
  //         description = "Specialized in Business Process Optimization, Software Development, and Data Analysis. Completed a final-year project on AI-powered workflow automation. GPA: 3.75 / 4.00";
  //       },
  //       {
  //         institution = "Jakarta State Senior High School 1";
  //         degree = "Science Major";
  //         period = {
  //           start = ?"2015-07";
  //           end = ?"2018-05";
  //         };
  //         description = "Focused on mathematics, physics, and computer science. Final Score: 91.25 / 100";
  //       },
  //     ];
  //     skills = ?{
  //       skills = [
  //         "Business Process Optimization",
  //         "Data Analysis",
  //         "System Integration",
  //         "Project Management",
  //         "Flutter",
  //         "Kotlin",
  //         "Google Cloud Platform",
  //         "Adobe Creative Suite",
  //         "AppSheet",
  //         "Workflow Automation",
  //         "Digital Transformation",
  //         "Root Cause Analysis",
  //       ];
  //     };
  //   };

  //   Debug.print("resumeData mock return " # debug_show (resumeData));
  //   return ?resumeData;
  // };
};
