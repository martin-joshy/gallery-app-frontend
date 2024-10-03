import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import api from "../../api/Api";
import { validateUsername, validatePassword } from "../../validators";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    setError("");

    try {
      await api.post("api/auth/register/", {
        username: values.username,
        email: values.email,
        password1: values.password,
        password2: values.confirm_password,
      });

      navigate("/login", {
        state: { toastMessage: "Verification email sent successfully." },
        replace: true,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const responseErrors = error.response.data;
        setErrors(responseErrors);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Registration failed. Please check your input and try again.",
        });
      } else {
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

  const RegistrationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[\w.@+-]+$/,
        "Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters."
      )
      .max(150, "Username must be at most 150 characters long.")
      .required("This field is required.")
      .test(
        "checkUsernameExists",
        "A user with that username already exists.",
        async (value) => {
          try {
            return await validateUsername(value);
          } catch (err) {
            setError(err.message);
            return false;
          }
        }
      ),
    email: Yup.string()
      .email("Enter a valid email address.")
      .max(320, "Email must be at most 320 characters long.")
      .required("This field is required."),
    password: Yup.string()
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
    confirm_password: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "The two password fields didn't match."
      )
      .required("This field is required."),
  });

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      }}
      validationSchema={RegistrationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, handleChange, values, errors, touched }) => (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
              <CardDescription>
                Create your account to get started
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

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Confirm your password"
                  />
                  {errors.confirm_password && touched.confirm_password && (
                    <div className="text-red-500 text-sm">
                      {errors.confirm_password}
                    </div>
                  )}
                </div>

                {error && <div className="text-red-600">{error}</div>}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </Form>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </Formik>
  );
};

export default Signup;
