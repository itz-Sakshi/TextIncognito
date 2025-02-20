"use client";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormItem, FormMessage, FormLabel, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";




const Verify = () => {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ username: string }>();

  // Delay reading params.username to prevent hydration mismatch
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (params?.username) {
      setUsername(params.username);
    }
  }, [params]);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      if (!username) return;
      const response = await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verification of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Verification error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-[86vh] bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-row justify-items-center">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} className="outline" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!username}>
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Verify;

