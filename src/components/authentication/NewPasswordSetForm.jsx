import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import { validatePassword } from "../../validators";

const NewPasswordSetForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/api/user-auth/password-reset-confirm/", {
        new_password1: values.new_password1,
        new_password2: values.new_password2,
        uid: uid,
        token: token,
      });
      toast({
        title: "Success",
        description: "Your password has been successfully changed.",
      });
      navigate("/login", {
        replace: true,
        state: {
          toastMessage:
            "Your password has been successfully changed. You can now log in with your new password.",
        },
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

  const NewPasswordSetSchema = Yup.object().shape({
    new_password1: Yup.string()
      .required("This field is required.")
      .test("validatePassword", "", async function (value) {
        try {
          const errors = await validatePassword(value);
          if (errors) {
            return this.createError({ message: errors.join(" ") });
          }
          return true;
        } catch (err) {
          setError(err.message);
          return false;
        }
      }),
    new_password2: Yup.string()
      .oneOf(
        [Yup.ref("new_password1"), null],
        "The two password fields didn't match."
      )
      .required("This field is required."),
  });

  return (
    <>
      <Formik
        initialValues={{
          new_password1: "",
          new_password2: "",
        }}
        validationSchema={NewPasswordSetSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, values, errors, touched }) => (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Create A Strong Password
                </CardTitle>
                <CardDescription>
                  Enter your new password to reset your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="new_password1">New Password</Label>
                    <Input
                      id="new_password1"
                      name="new_password1"
                      type="password"
                      value={values.new_password1}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Enter your new password"
                    />
                    {errors.new_password1 && touched.new_password1 && (
                      <div className="text-red-500 text-sm">
                        {errors.new_password1}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password2">Confirm New Password</Label>
                    <Input
                      id="new_password2"
                      name="new_password2"
                      type="password"
                      value={values.new_password2}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Confirm your new password"
                    />
                    {errors.new_password2 && touched.new_password2 && (
                      <div className="text-red-500 text-sm">
                        {errors.new_password2}
                      </div>
                    )}
                  </div>

                  {error && <div className="text-red-600">{error}</div>}

                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full"
                  >
                    {isSubmitting || loading
                      ? "Changing Password..."
                      : "Change Password"}
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

export default NewPasswordSetForm;
