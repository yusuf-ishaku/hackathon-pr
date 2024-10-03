/* eslint-disable prettier/prettier */
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Media } from "src/images/images.model";
class AiAgent {
    private APIKEY: string;
    private fileManager: GoogleAIFileManager;
    private GenAi: GoogleGenerativeAI;
    private model = "gemini-1.5-flash";
    private agent;
    constructor () {
     this.APIKEY = process.env.GOOGLE_AI_KEY
     this.fileManager = new GoogleAIFileManager(this.APIKEY);
     this.GenAi = new GoogleGenerativeAI(this.APIKEY);
     this.agent = this.GenAi.getGenerativeModel({model: this.model});
    }
    getTextResponse = async (prompt: string) => {
        const response = await this.agent.generateContent(prompt);
        return response;
    };
    getResponseToImagePrompt = async (prompt: string, image: Media) => {
        // const uploadResult = await this.fileManager.uploadFile(
        //     image.src,
        //     {
        //       mimeType: "image/jpeg",
        //       displayName: "Jetpack drawing",
        //     },
        // );
        const response = await this.agent.generateContent([
            prompt,
            {
                fileData: {
                    fileUri: image.src,
                    mimeType: "image/png"
                }
            }
        ]);
        return response;
    }
    
}

export default AiAgent