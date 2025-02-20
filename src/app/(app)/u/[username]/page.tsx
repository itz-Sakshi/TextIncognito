"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"; // Assuming you have a form component




type MessageFormData = z.infer<typeof messageSchema>;

const SendMessagePage = () => {
  const [questions, setQuestions] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const params = useParams();
  const username = params?.username; // Ensure we get the username
  const { toast } = useToast();

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const {setValue, handleSubmit } = form;

  const sendMessage = async (data: MessageFormData) => {
    setIsSending(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      console.error("Error sending Message:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    setQuestions("");

    try {
      const response = await fetch("/api/suggest-messages");

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream available");

      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        result += decoder.decode(value, { stream: true }); // Stream decoding
        setQuestions(result); // Update state progressively
        await new Promise((resolve) => setTimeout(resolve, 150)); // Smooth delay
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const copyToMessageBox = (data: string)=>{
    setValue("content", data);
  }

  return (
    <>
      <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(sendMessage)} className="space-y-2 h-[42vh] w-full">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Textarea {...field} placeholder="Type your message here." className="h-[30vh] p-4 outline m-auto my-4 w-[95vw]" />
                <FormMessage/>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSending} className="flex justify-center items-center w-1/4 m-auto">
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </form>
        </Form>
      </div>
      <div className="border-2 border-green-900 p-4 m-2 rounded-md">
        <Button onClick={fetchQuestions} disabled={loadingQuestions}>
          {loadingQuestions ? "Generating..." : "Generate Messages with AI"}
        </Button>
        <div>
          {questions
            ? questions.split("||").map((q, i) => <div key={i}>
               <p className="flex my-2 justify-between">{q} <Button onClick={() => copyToMessageBox(q)}>Copy Message</Button></p>
              </div>)
            : "Click to generate!"}
        </div>
      </div>
    </>
  );
};

export default SendMessagePage;
