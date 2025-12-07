import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, PatientDetails } from "../types";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFingerprint = async (base64Image: string, patientDetails: PatientDetails): Promise<AnalysisResult> => {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
      Generate a professional medical analysis report for the following patient based on the provided fingerprint scan (or simulated scan data).

      Patient Details:
      - Name: ${patientDetails.fullName}
      - Father's Name: ${patientDetails.fatherName}
      - Age: ${patientDetails.age}
      - Gender: ${patientDetails.gender}
      - Contact: ${patientDetails.contactNumber}

      Task:
      1. Analyze the image for dermatoglyphic patterns (Loop, Whorl, Arch). If the image is a simulation/placeholder, infer a pattern based on statistical likelihoods for a demonstration.
      2. Predict the most likely ABO blood group based on the dermatoglyphic pattern (e.g., Whorls often correlate with O+, Loops with A).
      3. Generate a confidence score (70-98%) based on pattern clarity.
      4. Provide a professional medical reasoning.

      Output must be a strictly structured JSON object.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN, description: "Always true for this reporting tool unless image is corrupt." },
            fingerprintType: { type: Type.STRING, enum: ["Loop", "Whorl", "Arch", "Composite"] },
            predictedBloodGroup: { type: Type.STRING, description: "e.g., 'O+', 'A-', 'B+', 'AB+'" },
            confidenceScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING, description: "Professional medical phrasing explaining the finding." },
            probabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  group: { type: Type.STRING },
                  percentage: { type: Type.NUMBER }
                }
              }
            },
            reportId: { type: Type.STRING, description: "A generated unique report ID string (e.g. DGP-2024-XXX)" }
          },
          required: ["detected", "predictedBloodGroup", "reportId"]
        }
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    const parsedResult = JSON.parse(resultText);
    
    // Merge patient details back into result for display
    return {
      ...parsedResult,
      patientDetails: patientDetails,
      reportDate: new Date().toLocaleDateString()
    } as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      detected: false,
      error: "Unable to generate report. Please try the scan again."
    };
  }
};