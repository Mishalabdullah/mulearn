import React, { useEffect, useState } from "react";
import styles from "./Onboarding.module.css";
type Props = {};
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import Error from "./assets/Error";
import Success from "./Success";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Looder from "./assets/Looder";
import { useFormik } from "formik";

const animatedComponents = makeAnimated();

const Onboarding = (props: Props) => {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  // for hide and question container
  const [displayLoader, setDisplayLoader] = useState("flex");
  const [opacityLoader, setOpacityLoader] = useState(1);
  setTimeout(() => {
    setDisplayLoader("none");
    setOpacityLoader(0);
  }, 5000);
  const [display, setDisplay] = useState("flex");
  const [display2, setDisplay2] = useState("flex");
  const [opacity, setOpacity] = useState(1);
  const [opacity2, setOpacity2] = useState(1);
  const [secondQuesion, setSecondQuesion] = useState(false);
  //Getting the token from the URL
  const token = queryParameters.get("id");
  //State Variables for the From
  const [role, setRole] = useState([{ id: "", title: "" }]);
  const [tcChecked, setTcChecked] = useState(false);
  //State Variable for the Form Submission Validation
  const [formSuccess, setFormSuccess] = useState(false);
  const [hasError, setHasError] = useState({
    error: false,
    statusCode: 0,
    message: "",
  });

  const [hasValidationError, setHasValidationError] = useState({
    error: false,
    message: "",
  });

  const [roleVerified, setRoleVerified] = useState(false);

  //State Array for Storing the Organization(Company, Community, College)
  const [organization, setOrganization] = useState("");
  const [community, setCommunity] = useState<string[]>([]);

  //State Array for storing the College Options
  const [collegeAPI, setCollegeAPI] = useState([{ id: "", title: "" }]);
  //State Array for storing the College Options(Search)
  const [collegeOptions, setCollegeOptions] = useState([
    { value: "", label: "" },
  ]);

  //State Array for storing the Department Options
  const [departmentAPI, setDepartmentAPI] = useState([{ id: "", title: "" }]);
  //State Array for storing the Company Options
  const [companyAPI, setCompanyAPI] = useState([{ id: "", title: "" }]);
  //State Array for storing the Community Options
  const [communityAPI, setCommunityAPI] = useState([{ id: "", title: "" }]);
  //State Array for storing the Mentor Role Options
  const [roleAPI, setRoleAPI] = useState([{ id: "", title: "" }]);
  //State Array for storing the Area of Interest Options
  const [aoiAPI, setAoiAPI] = useState([{ id: "", name: "" }]);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "none",
      background: "rgba(239, 241, 249, 0.6)",
      borderRadius: "6px",
      outline: "none",
      marginTop: "10px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F8F8F8" : "white",
      color: "#4A4A4A",
      padding: "8px 20px",
      "&:hover": {
        backgroundColor: "#F8F8F8",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: "0",
      borderRadius: "0",
      boxShadow: "none",
    }),
  };

  const yog_year = [
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
    2027, 2028, 2029, 2030,
  ];

  useEffect(() => {
    // request for token verification
    const token_check = {
      method: "GET",
      url:
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/register/jwt/validate",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    };
    axios
      .request(token_check)
      .then((response) => {})
      .catch((error) => {
        console.log(error);

        setHasError({
          error: error.response.data.hasError,
          statusCode: error.response.data.statusCode,
          message: error.response.data.message.general,
        });
      });

    // request for college list
    const college = {
      method: "GET",
      url:
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/register/college/list",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    };
    axios
      .request(college)
      .then(function (response) {
        const colleges = response.data.response.colleges;
        setCollegeAPI(colleges);
        setCollegeOptions(
          colleges
            .sort((a: any, b: any) => a.title.localeCompare(b.title))
            .map((college: any) => ({
              value: college.id,
              label: college.title,
            }))
        );
        setDepartmentAPI(response.data.response.departments);
      })
      .catch(function (error) {
        if (error.response.status === 404 || error.response.status === 500) {
          const errorMessage = {
            error: true,
            statusCode: error.response.data.status,
            message: "Something went wrong, Please try again Later",
          };
          setHasError(errorMessage);
        }
      });

    // request for company list
    const company = {
      method: "GET",
      url:
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/register/company/list",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    };
    axios
      .request(company)
      .then(function (response) {
        setCompanyAPI(response.data.response.companies);
      })
      .catch(function (error) {
        if (error.response.status === 404 || error.response.status === 500) {
          const errorMessage = {
            error: true,
            statusCode: error.response.data.status,
            message: "Something went wrong, Please try again Later",
          };
          setHasError(errorMessage);
        }
      });

    // request for role list
    const role = {
      method: "GET",
      url: import.meta.env.VITE_BACKEND_URL + "/api/v1/user/register/role/list",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    };
    axios
      .request(role)
      .then(function (response) {
        setRoleAPI(response.data.response.roles);
      })
      .catch(function (error) {
        if (
          error.response.data.statusCode === 404 ||
          error.response.data.statusCode === 500
        ) {
          setHasError({
            error: true,
            statusCode: error.response.data.statusCode,
            message: "Something went wrong, please try again later",
          });
        }
      });

    // request for area of intersts list
    const aoi = {
      method: "GET",
      url:
        import.meta.env.VITE_BACKEND_URL +
        "/api/v1/user/register/area-of-interest/list",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    };
    axios
      .request(aoi)
      .then(function (response) {
        setAoiAPI(response.data.response.aois);
      })
      .catch(function (error) {
        if (error.response.status === 404 || error.response.status === 500) {
          const errorMessage = {
            error: true,
            statusCode: error.response.data.status,
            message: "Something went wrong, Please try again Later",
          };
          setHasError(errorMessage);
        }
      });

    // request for community list
    const comunity = {
      method: "GET",
      url:
        import.meta.env.VITE_BACKEND_URL +
        "/api/v1/user/register/community/list",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    };
    axios
      .request(comunity)
      .then(function (response) {
        setCommunityAPI(response.data.response.communities);
      })
      .catch(function (error) {
        if (error.response.status === 404 || error.response.status === 500) {
          const errorMessage = {
            error: true,
            statusCode: error.response.data.status,
            message: "Something went wrong, Please try again Later",
          };
          setHasError(errorMessage);
        }
      });
  }, []);

  // formik

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: void 0,
    gender: "",
    dob: "",
    role: "",
    organization: "",
    community,
    dept: "",
    yog: "",
    mentorRole: "",
    areaOfInterest: [],
  };
  const onSubmit = (values: any) => {
    console.log(values);
    values.community.id.push(values.organization);
    const options = {
      method: "POST",
      url: import.meta.env.VITE_BACKEND_URL + "/api/v1/user/register/",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
      data: {
        firstName: values.firstName, //required
        lastName: values.lastName === "" ? null : values.lastName,
        email: values.email, //required
        mobile: values.phone, //required
        gender: values.gender === "" ? null : values.gender,
        dob: values.dob === "" ? null : values.dob,
        role: role[0]["id"], //required
        organizations:
          values.organization === "" && values.community.id.length === 0
            ? null
            : values.community.id, //required except for individual
        dept: values.dept === "" ? null : values.dept, //required for student and enabler
        yearOfGraduation: values.yog === "" ? null : values.yog, //required for student
        areaOfInterests: values.areaOfInterest, //required
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setFormSuccess(true);
        setRoleVerified(response.data.roleVerified);
      })
      .catch(function (error) {
        setHasValidationError({
          error: true,
          message: error.response.data.message,
        });
        setTimeout(() => {
          setHasValidationError({
            error: false,
            message: "",
          });
        }, 3000);
      });
  };

  const validate = (values: any) => {
    let errors: any = {};
    if (!values.firstName) {
      errors.firstName = "First name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }
    if (!values.phone) {
      errors.phone = "Phone number is required";
    } else if (values.phone.toString().length != 10) {
      errors.phone = "Phone number is invalid";
    }
    if (!values.organization) {
      errors.organization = "This field is required";
    }
    if (!values.dept) {
      errors.dept = "Department is required";
    }
    if (!values.yog) {
      errors.yog = "Year of graduation is required";
    }
    if (!values.mentorRole) {
      errors.mentorRole = "Type is required";
    }
    if (!values.areaOfInterest) {
      errors.areaOfInterest = "Area of interest is required";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  // console.log(formik.values);

  return (
    <>
      <div className={styles.onboarding_page}>
        {!hasError.error ? (
          <>
            {!formSuccess ? (
              <>
                {hasValidationError.error ? (
                  <div className={styles.validation_error_message}>
                    <p>{hasValidationError.message}</p>
                  </div>
                ) : (
                  ""
                )}
                <div className={styles.form_container}>
                  {/* <div
                    className={styles.loader_container}
                    style={{ display: displayLoader, opacity: opacityLoader }}
                  >
                    <div className={styles.loader}>
                      <Looder />
                    </div>
                    <p>We are cooking things for you</p>
                  </div> */}

                  <div
                    style={{ display: display, opacity: opacity }}
                    className={styles.question_container}
                  >
                    <div className={styles.question_box}>
                      <div className={styles.question}>
                        <h3>What is your role ?</h3>
                        <div className={styles.answers}>
                          <button
                            onClick={() => {
                              roleAPI.map((role: any) => {
                                if (role.title === "Student") {
                                  setRole([{ id: role.id, title: role.title }]);
                                }
                              });
                              setOpacity(0);
                              setTimeout(() => {
                                setDisplay("none");
                              }, 1000);
                            }}
                          >
                            I'm currently studying
                          </button>
                          <button
                            onClick={() => {
                              setOpacity(0);
                              setSecondQuesion(true);
                              setTimeout(() => {
                                setDisplay("none");
                              }, 1000);
                            }}
                          >
                            I'm currently working professional
                          </button>
                          <button
                            onClick={() => {
                              roleAPI.map((role: any) => {
                                if (role.title === "Enabler") {
                                  setRole([{ id: role.id, title: role.title }]);
                                }
                              });

                              setOpacity(0);
                              setTimeout(() => {
                                setDisplay("none");
                              }, 1000);
                            }}
                          >
                            I'm teaching in a institute
                          </button>
                          <button
                            onClick={() => {
                              setOpacity(0);
                              setSecondQuesion(true);
                              setTimeout(() => {
                                setDisplay("none");
                              }, 1000);
                            }}
                          >
                            I'm a freelancer
                          </button>
                          <button
                            onClick={() => {
                              setOpacity(0);
                              setTimeout(() => {
                                setDisplay("none");
                              }, 1000);
                            }}
                          >
                            I'm not working, not studying
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*2nd question if the user is working prof. or freelancer  */}
                  {secondQuesion ? (
                    <div
                      style={{ display: display2, opacity: opacity2 }}
                      className={styles.question_container}
                    >
                      <div className={styles.question_box}>
                        <div className={styles.question}>
                          <h3>Did you like to become a Mentor ?</h3>
                          <div className={styles.answers}>
                            <button
                              onClick={() => {
                                setRole([{ id: "", title: "" }]);
                                setOpacity2(0);
                                setTimeout(() => {
                                  setDisplay2("none");
                                }, 1000);
                              }}
                            >
                              No
                            </button>
                            <button
                              onClick={() => {
                                roleAPI.map((role: any) => {
                                  if (role.title === "Mentor") {
                                    setRole([
                                      { id: role.id, title: role.title },
                                    ]);
                                  }
                                });

                                setOpacity2(0);
                                setTimeout(() => {
                                  setDisplay2("none");
                                }, 1000);
                              }}
                            >
                              Yes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <h1>User Information</h1>
                  <p>
                    Please enter all the required information in the fields
                    provided below. Please be aware that once you have submitted
                    this information, you will not be able to make any changes
                    or updates. <b>Don't use autofill to fill in the form.</b>
                  </p>
                  <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <div>
                      <div className={styles.inputs}>
                        <div className={styles.input_container}>
                          <label htmlFor="">
                            First Name{" "}
                            <span className={styles.required}>*</span>
                          </label>
                          <input
                            id="first_name"
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            className={styles.input}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                          />
                          {formik.touched.firstName &&
                          formik.errors.firstName ? (
                            <div className={styles.error_message}>
                              {formik.errors.firstName}
                            </div>
                          ) : null}
                        </div>
                        <div className={styles.input_container}>
                          <label htmlFor="">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            className={styles.input}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                          />
                        </div>
                      </div>
                      <div className={styles.inputs}>
                        <div className={styles.input_container}>
                          <label htmlFor="">
                            Email address{" "}
                            <span className={styles.required}>*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="username@domain.com"
                            className={styles.input}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            // required
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <div className={styles.error_message}>
                              {formik.errors.email}
                            </div>
                          ) : null}
                        </div>
                        <div className={styles.input_container}>
                          <label htmlFor="">
                            Phone number{" "}
                            <span className={styles.required}>*</span>
                          </label>
                          <div className={styles.grouped_inputs}>
                            <select
                              style={{ width: "20%", textAlign: "center" }}
                              name=""
                              id=""
                            >
                              <option value="+91">+91</option>
                            </select>
                            <input
                              id="phone_field"
                              name="phone"
                              style={{ width: "78%" }}
                              type="number"
                              placeholder="8023456789"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.phone}
                              // required
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                              <div className={styles.error_message}>
                                {formik.errors.phone}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className={styles.inputs}>
                        <div className={styles.input_container}>
                          <div className={styles.grouped_inputs}>
                            <div
                              style={{ width: "49%" }}
                              className={styles.input_container}
                            >
                              <label htmlFor="">Gender</label>
                              <select
                                name="gender"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.gender}
                              >
                                <option value="">Select gender</option>
                                <option value="male">
                                  <span className={styles.gender}>♂</span> Male
                                </option>
                                <option value="male">
                                  <span className={styles.gender}>♀</span>{" "}
                                  Female
                                </option>
                                <option value="other">Other</option>
                                <option value="not to say">
                                  Prefer not to say
                                </option>
                              </select>
                            </div>
                            <div
                              style={{ width: "49%" }}
                              className={styles.input_container}
                            >
                              <label htmlFor="">Date of Birth</label>
                              <input
                                id="gender_field"
                                name="dob"
                                type="date"
                                placeholder="dd/mm/yyyy"
                                className={styles.input}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.dob}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={styles.input_container}>
                          <div
                            style={{ width: "100%" }}
                            className={styles.input_container}
                          >
                            <label htmlFor="">Community </label>
                            <Select
                              name="community.id"
                              // value={}
                              onChange={(OnChangeValue) => {
                                // console.log(OnChangeValue.map((value={value:"", label:""}) => value.value));
                                // setCommunity(OnChangeValue.map((community:Community) => community.value));
                                OnChangeValue.map(
                                  (
                                    value: unknown,
                                    index: number,
                                    array: readonly unknown[]
                                  ) => {
                                    const typedValue = value as {
                                      value: string;
                                      label: string;
                                    };
                                    setCommunity([
                                      ...community,
                                      typedValue.value,
                                    ]);
                                    formik.handleChange({
                                      target: {
                                        name: "community.id",
                                        value: [...community, typedValue.value],
                                      },
                                    });
                                  }
                                );
                              }}
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={communityAPI.map((company) => {
                                return {
                                  value: company.id,
                                  label: company.title,
                                };
                              })}
                            />
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                      <div className={styles.inputs}>
                        {role[0].title == "Student" ||
                        role[0].title == "Enabler" ? (
                          <>
                            <div className={styles.input_container}>
                              <label htmlFor="">
                                College{" "}
                                <span className={styles.required}>*</span>
                              </label>
                              <ReactSelect
                                id="college_field"
                                name="organization"
                                value={
                                  organization.length > 0 &&
                                  collegeOptions.find(
                                    (college) => college.value === organization
                                  )
                                }
                                onChange={(option) => {
                                  option && setOrganization(option.value);
                                  formik.handleChange({
                                    target: {
                                      name: "organization",
                                      value: option && option.value,
                                    },
                                  });
                                }}
                                options={collegeOptions}
                                isClearable={false}
                                placeholder="Select college..."
                                noOptionsMessage={() => (
                                  <a
                                    href="https://airtable.com/shrfongm5JG8J53rD"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <p className={styles.add_college}>
                                      College Not Found, Add College
                                    </p>
                                  </a>
                                )}
                                filterOption={({ label }, inputValue) =>
                                  label
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                }
                                styles={customStyles}
                                onBlur={formik.handleBlur}
                                // required
                              />
                              {formik.touched.organization &&
                              formik.errors.organization ? (
                                <div className={styles.error_message}>
                                  {formik.errors.organization}
                                </div>
                              ) : null}
                            </div>

                            <div className={styles.input_container}>
                              <div className={styles.grouped_inputs}>
                                <div
                                  style={
                                    role[0].title === "Student"
                                      ? { width: "58%" }
                                      : { width: "100%" }
                                  }
                                  className={styles.input_container}
                                >
                                  <label htmlFor="">
                                    Department{" "}
                                    <span className={styles.required}>*</span>
                                  </label>
                                  <select
                                    id="dept_field"
                                    name="dept"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.dept}
                                    // value={dept}
                                    // required
                                  >
                                    <option value="">Select</option>
                                    {departmentAPI.map((dept, index) => {
                                      return (
                                        <option key={index} value={dept.id}>
                                          {dept.title}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  {formik.touched.dept && formik.errors.dept ? (
                                    <div className={styles.error_message}>
                                      {formik.errors.dept}
                                    </div>
                                  ) : null}
                                </div>
                                {role[0].title == "Student" ? (
                                  <div
                                    style={{ width: "40%" }}
                                    className={styles.input_container}
                                  >
                                    <label htmlFor="">
                                      Graduation Year{" "}
                                      <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                      id="yog_field"
                                      style={{ width: "100%" }} //78%
                                      name="yog"
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.yog}
                                      // required
                                    >
                                      <option value="">Select</option>
                                      {yog_year.map((year, i) => {
                                        return (
                                          <option key={i} value={year}>
                                            {year}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    {formik.touched.yog && formik.errors.yog ? (
                                      <div className={styles.error_message}>
                                        {formik.errors.yog}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {role[0].title == "Mentor" ? (
                              <div className={styles.input_container}>
                                <label htmlFor="">
                                  Type{" "}
                                  <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.grouped_inputs}>
                                  <select
                                    id="mentortype_filed"
                                    style={{ width: "100%" }} //78%
                                    name="mentorRole"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.mentorRole}
                                    // required
                                  >
                                    <option value="">Select</option>
                                    <option value="Company">Company</option>
                                    <option value="Individual">
                                      Individual
                                    </option>
                                  </select>
                                  {formik.touched.mentorRole &&
                                  formik.errors.mentorRole ? (
                                    <div className={styles.error_message}>
                                      {formik.errors.mentorRole}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}
                            {formik.values.mentorRole == "Company" ? (
                              <div className={styles.input_container}>
                                <label htmlFor="">
                                  Company{" "}
                                  <span className={styles.required}>*</span>
                                </label>
                                <select
                                  id="company_field"
                                  name="organization"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.organization}
                                  required
                                >
                                  <option value="">Select</option>
                                  {companyAPI.map((company, index) => {
                                    return (
                                      <option key={index} value={company.id}>
                                        {company.title}
                                      </option>
                                    );
                                  })}
                                </select>
                                {formik.touched.organization &&
                                formik.errors.organization ? (
                                  <div className={styles.error_message}>
                                    {formik.errors.organization}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>

                      <div className={styles.inputs}>
                        <div className={styles.label_container}>
                          <label htmlFor="">
                            Areas of Interest / Stack{" "}
                            <span className={styles.required}>*</span>
                          </label>
                        </div>

                        <div className={styles.aoi_container}>
                          {aoiAPI.map((aoi, i) => {
                            const checked =
                              formik.values.areaOfInterest.includes(
                                aoi.id as never
                              );
                            const disabled =
                              formik.values.areaOfInterest.length >= 3 &&
                              !checked;
                            return (
                              <label key={i}>
                                <input
                                  name="areaOfInterest"
                                  onBlur={formik.handleBlur}
                                  value={formik.values.areaOfInterest}
                                  // value={aoi.id}
                                  type="checkbox"
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={(e) => {
                                    const selectedId = aoi.id;
                                    if (checked) {
                                      formik.setFieldValue(
                                        "areaOfInterest",
                                        formik.values.areaOfInterest.filter(
                                          (aois) => aois !== selectedId
                                        )
                                      );
                                    } else {
                                      formik.setFieldValue(
                                        "areaOfInterest",
                                        [
                                          ...formik.values.areaOfInterest,
                                          selectedId,
                                        ].slice(-3)
                                      );
                                    }
                                  }}
                                  // required
                                />
                                <span>{aoi.name}</span>
                              </label>
                            );
                          })}
                          {formik.touched.areaOfInterest &&
                          formik.values.areaOfInterest.length == 0 ? (
                            <div className={styles.error_message}>
                              Please select atleast one area of interest
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className={styles.form_bottom}>
                      <div className={styles.checkbox}>
                        <input
                          className={styles.input_checkbox}
                          type="checkbox"
                          checked={tcChecked}
                          name=""
                          id=""
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTcChecked(true);
                            } else {
                              setTcChecked(false);
                            }
                          }}
                        />
                        <label className={styles.tc_text} htmlFor="">
                          I Agree, the{" "}
                          <a
                            href="http://mulearn.org/termsandconditions"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className={styles.tc_span}>
                              Terms and Conditions
                            </span>
                          </a>{" "}
                          and the{" "}
                          <a
                            href="http://mulearn.org/privacypolicy"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className={styles.tc_span}>
                              Privacy Policy
                            </span>
                          </a>
                        </label>
                      </div>
                      <div className={styles.form_buttons}>
                        <button
                          type="reset"
                          onClick={() => {
                            formik.values.areaOfInterest = [];

                            formik.values.firstName = "";
                            formik.values.lastName = "";
                            formik.values.email = "";
                            formik.values.phone = void 0;
                            // setRole([{ id: "", title: "" }]);
                            formik.values.dept = "";
                            formik.values.organization = "";
                            formik.values.yog = "";
                            formik.values.mentorRole = "";
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!tcChecked}
                          style={
                            tcChecked
                              ? { backgroundColor: "#5570f1" }
                              : { backgroundColor: "#5570f1", opacity: "0.5" }
                          }
                          onClick={(e) => {
                            validate(formik.values);
                            if (
                              formik.values.firstName == "" ||
                              formik.errors.firstName ||
                              formik.errors.email ||
                              formik.errors.phone ||
                              formik.errors.areaOfInterest ||
                              (role[0]["title"] == "Student"
                                ? formik.errors.organization ||
                                  formik.errors.dept ||
                                  formik.errors.yog
                                : null) ||
                              (role[0]["title"] == "Mentor"
                                ? formik.errors.mentorRole
                                : null) ||
                              (formik.values.mentorRole == "Company"
                                ? formik.errors.organization
                                : null) ||
                              (formik.values.areaOfInterest.length == 0
                                ? true
                                : null)
                            ) {
                              console.log("error");
                            } else {
                              console.log(formik.values);

                              console.log("no error");
                              // onSubmit(formik.values);
                            }
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <Success roleVerified={roleVerified} />
            )}
          </>
        ) : (
          <div className={styles.error_msg}>
            <div className={styles.tik}>
              <Error />
            </div>
            <br />
            <br />
            <p>{hasError ? hasError.message : "Loading..."}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Onboarding;