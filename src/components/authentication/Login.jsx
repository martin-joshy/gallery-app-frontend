import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast({
        title: "Success",
        description: location.state.toastMessage,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError("");

    try {
      let res = await api.post("api/auth/login/", {
        username: values.username,
        password: values.password,
      });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/home", { replace: true });
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

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .max(150, "Username must be at most 150 characters long.")
      .required("This field is required."),
    password: Yup.string().required("This field is required."),
  });

  return (
    <>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, values, errors, touched }) => (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={values.username}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Enter your username"
                    />
                    {errors.username && touched.username && (
                      <div className="text-red-500 text-sm">
                        {errors.username}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Enter your password"
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-sm">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {error && <div className="text-red-600">{error}</div>}

                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full"
                  >
                    {isSubmitting || loading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-500 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <Link
                  to="/login/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot your password?
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </Formik>
      <Toaster />
    </>
  );
};

export default LoginForm;
