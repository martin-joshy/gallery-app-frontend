import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import api from "../../api/Api";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/password-reset/", {
        email: values.email,
      });
      navigate("/login", {
        replace: true,
        state: { toastMessage: "Password reset email sent successfully." },
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const firstKey = Object.keys(error.response.data)[0];
        setError(error.response.data[firstKey]);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data[firstKey],
        });
      } else {
        setError("An unexpected error occurred. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    }

    setLoading(false);
    setSubmitting(false);
  };

  const PasswordResetSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email address.")
      .max(320, "Email must be at most 320 characters long.")
      .required("This field is required."),
  });

  return (
    <>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={PasswordResetSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, values, errors, touched }) => (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Forgot Password
                </CardTitle>
                <CardDescription>
                  Enter your email and we will send you a link to get back into
                  your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Enter your email"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>

                  {error && <div className="text-red-600">{error}</div>}

                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full"
                  >
                    {isSubmitting || loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Form>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <p className="text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    Log in
                  </Link>
                </p>
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-500 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </Formik>
      <Toaster />
    </>
  );
};

export default ForgotPasswordForm;
