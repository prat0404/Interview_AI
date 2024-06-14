import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DropzoneArea } from 'material-ui-dropzone';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { set } from "firebase/database";
import useFirestore from "@/hooks/useFirestore";
// import { DropzoneArea } from "material-ui-dropzone";

function AccountInfoPopup({ user, onClose }: any) {
  const [changeEmail, setChangeEmail] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);

  const [username, setUsername] = useState(
    user.displayName ? user.displayName : ""
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = React.useState("");

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();

  const {
    updateUserEmail,
    updateUserProfile,
    uploadProfileImage,
    deleteUserFromFirestore,
    
  } = useFirestore();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!image) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleEmailChange = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter your current email and password");
      console.error("Please enter your current email and password");
      return;
    }

    if (email !== user.email) {
      setErrorMessage("Current email is incorrect");
      console.error("Current email is incorrect");
      return;
    }

    if (newEmail.length === 0) {
      setErrorMessage("New email cannot be empty");
      console.error("New email cannot be empty");
      return;
    }

    if (newEmail === user.email) {
      setErrorMessage("New email cannot be the same as old email");
      console.error("New email cannot be the same as old email");
      return;
    }

    const credential = EmailAuthProvider.credential(email, password);

    reauthenticateWithCredential(user, credential)
      .then((res) => {
        console.log("verifyBeforeUpdateEmail success", res);
        updateEmail(user, newEmail)
          .then(() => {
            console.log("change email success");
            updateUserEmail({ oldEmail: email, newEmail, uid: user.uid })
              .then(() => {
                console.log("update user email in database success");
              })
              .catch((error) => {
                console.error("Error in update user email in database:", error);
              });
            setSuccessMessage("Email successfully changed");
            setNewEmail("");
            setEmail("");
            setPassword("");
          })
          .catch((error) => {
            console.error("Error in change email:", error);
          });
      })
      .catch((error) => {
        console.error("Error in verifyBeforeUpdateEmail:", error);
        setErrorMessage("New email already exists");
        return;
      });
  };

  const handlePasswordChange = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    reauthenticateWithCredential(user, credential)
      .then(() => {
        console.log("reauthenticated");

        if (newPassword.length < 6) {
          setErrorMessage("Password must be at least 6 characters");
          console.error("Password must be at least 6 characters");
          return;
        }

        if (newPassword === oldPassword) {
          setErrorMessage("New password cannot be the same as old password");
          console.error("New password cannot be the same as old password");
          return;
        }

        if (newPassword !== confirmNewPassword) {
          setErrorMessage("Passwords do not match");
          console.error("Passwords do not match");
          return;
        }

        updatePassword(user, newPassword)
          .then(() => {
            console.log("change password success");
            setSuccessMessage("Password successfully changed");
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
          })
          .catch((error) => {
            console.error("Error in change password:", error);
          });
      })
      .catch((error: any) => {
        setErrorMessage("Old Password Incorrect");
        console.error("Error in reauthenticateWithCredential:", error);
      });
  };

  const handleProfileChange = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (username.length === 0) {
      setErrorMessage("Username cannot be empty");
      console.error("Username cannot be empty");
      return;
    }

    // if (username === user.displayName) {
    //   setErrorMessage("Username cannot be the same as old username");
    //   console.error("Username cannot be the same as old username");
    //   return;
    // }

    if (image) {
      uploadProfileImage({ email: user.email, file: image })
        .then((url: any) => {
          console.log("url from front", url);

          console.log("upload profile image success");
          updateProfile(user, {
            displayName: username,
            photoURL: url,
          })
            .then(() => {
              console.log("update profile success");
              updateUserProfile({
                email: user.email,
                displayName: username,
                photoURL: url,
              })
                .then(() => {
                  console.log("update user profile in database success");
                  setImage(null);
                  setErrorMessage("");
                  setSuccessMessage("Profile successfully changed");
                  handleCancel();
                })
                .catch((error) => {
                  console.error(
                    "Error in update user profile in database:",
                    error
                  );
                });
              setSuccessMessage("Profile successfully changed");
              // setUsername("");
            })
            .catch((error) => {
              console.error("Error in update profile:", error);
            });
        })
        .catch((error) => {
          console.error("Error in upload profile image:", error);
        });
      return;
    } else {
      if (user.photoURL) {
        updateProfile(user, {
          displayName: username,
          photoURL: user.photoURL,
        })
          .then(() => {
            console.log("update profile success");
            updateUserProfile({
              email: user.email,
              displayName: username,
              photoURL: user.photoURL,
            })
              .then(() => {
                console.log("update user profile in database success");
                setImage(null);
                setErrorMessage("");
                setSuccessMessage("Profile successfully changed");
                handleCancel();
              })
              .catch((error) => {
                console.error(
                  "Error in update user profile in database:",
                  error
                );
              });
            setSuccessMessage("Profile successfully changed");
            // setUsername("");
          })
          .catch((error) => {
            console.error("Error in update profile:", error);
          });
      } else {
        updateProfile(user, {
          displayName: username,
        })
          .then(() => {
            console.log("update profile success");
            updateUserProfile({
              email: user.email,
              displayName: username,
              photoURL: "",
            })
              .then(() => {
                console.log("update user profile in database success");
                setImage(null);
                setErrorMessage("");
                setSuccessMessage("Profile successfully changed");
                handleCancel();
              })
              .catch((error) => {
                console.error(
                  "Error in update user profile in database:",
                  error
                );
              });
            setSuccessMessage("Profile successfully changed");
            // setUsername("");
          })
          .catch((error) => {
            console.error("Error in update profile:", error);
          });
      }
    }
  };

  const handleDeleteAccount = () => {
    console.log("handleDeleteAccount started");
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length === 0) {
      setErrorMessage("Password cannot be empty");
      console.error("Password cannot be empty");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    console.log("Credential created: ", credential);

    const emailID = user.email;
    console.log("Email ID: ", emailID);

    reauthenticateWithCredential(user, credential)
      .then(() => {
        console.log("reauthenticated");

        deleteUser(user)
          .then(() => {
            console.log("delete account success");
            setSuccessMessage("Account successfully deleted");
            deleteUserFromFirestore({ email: emailID })
              .then(() => {
                console.log("delete user from database success");
                onClose();
              })
              .catch((error) => {
                console.error("Error in delete user from database:", error);
              });
          })
          .catch((error) => {
            console.error("Error in delete account:", error);
          });
      })
      .catch((error: any) => {
        setErrorMessage("Password Incorrect");
        console.error("Error in reauthenticateWithCredential:", error);
      });
  };

  const handleEmailChangeToggle = () => {
    setChangeEmail(true);
    setChangePassword(false);
  };

  const handlePasswordChangeToggle = () => {
    setChangeEmail(false);
    setChangePassword(true);
  };

  const handleProfileChangeToggle = () => {
    setEditProfile(!editProfile);
    setChangeEmail(false);
    setChangePassword(false);
  };

  const handleCancel = () => {
    setChangeEmail(false);
    setChangePassword(false);
    setEditProfile(false);
  };

  const getTitle = () => {
    if (changeEmail) {
      return "Change Email";
    } else if (changePassword) {
      return "Change Password";
    } else if (editProfile) {
      return "Update Profile";
    } else {
      return "Account";
    }
  };

  const getPath = () => {
    if (changeEmail) {
      return "Account / Change Email";
    } else if (changePassword) {
      return "Security / Change Password";
    } else if (editProfile) {
      return "Account / Profile";
    } else {
      return "";
    }
  };

  // console.log(user);

  // setTimeout(() => {
  // console.log("image", image);
  // console.log("preview", preview);
  // }, 30000);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "50%",
          maxWidth: "none",
          height: "85%",
          maxHeight: "none",
          borderRadius: "1rem",
          padding: "1.5rem",
        },
      }}
    >
      <DialogContent>
        {(changeEmail || changePassword || editProfile) && (
          <div>
            {/* Breadcrumb path */}
            <p
              style={{
                color: "rgba(0, 0, 0, 0.65)",
                margin: "0px",
                fontSize: "0.9rem",
              }}
            >
              {changeEmail && (
                <PersonIcon
                  style={{ fontSize: "0.9rem", marginRight: "0.5rem" }}
                />
              )}
              {changePassword && (
                <SecurityIcon
                  style={{ fontSize: "0.9rem", marginRight: "0.5rem" }}
                />
              )}
              {editProfile && (
                <PersonIcon
                  style={{ fontSize: "0.9rem", marginRight: "0.5rem" }}
                />
              )}
              {getPath()}
            </p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>
            <div>
              <h1
                style={{
                  color: "black",
                  margin: "0px",
                  fontWeight: "600",
                  fontSize: "2rem",
                  lineHeight: "1.5",
                }}
              >
                {getTitle()}
              </h1>
              <p
                style={{
                  color: "rgba(0, 0, 0, 0.65)",
                  margin: "0px",
                  fontSize: "1rem",
                  fontWeight: "400",
                  lineHeight: "1.25",
                }}
              >
                {changeEmail && " "} {/* Add space if it's Change Email */}
              </p>
            </div>
          </DialogTitle>
        </div>
        <IconButton
          style={{ position: "absolute", top: "2rem", right: "2rem" }}
          onClick={onClose}
          color="inherit"
        >
          <CloseIcon />
        </IconButton>

        {changeEmail && (
          <>
            {/* Remove "Update your email address" */}
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Current Email Address"
                type="email"
                fullWidth
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="dense"
                id="password"
                label="Confirm Password"
                type="password"
                fullWidth
                value={password}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* TextField for new email */}
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="New Email"
                autoComplete="off"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEmailChange}
                style={{
                  backgroundColor: "#172554",
                  color: "white",
                  fontSize: "0.8125rem",
                  fontWeight: "500",
                  padding: "8px 16px",
                  outline: "none",
                  border: "none",
                }}
              >
                Save
              </Button>
            </DialogActions>
            {errorMessage && (
              <p style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </p>
            )}
          </>
        )}

        {editProfile && (
          <>
            {/* Display the avatar and image upload button in profile edit mode */}

            <DialogContent>
              <div
                style={{ display: "flex", alignItems: "center" }}
                className="justify-between"
              >
                <div className="flex flex-col w-2/3">
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Enter Your Name"
                    type="text"
                    // defaultValue={user.displayName ? user.displayName : ""}
                    value={username}
                    autoComplete="off"
                    // disabled={user.displayName}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p
                    style={{
                      color: "black",
                      margin: "0px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      lineHeight: "2",
                    }}
                  >
                    Profile Image
                  </p>
                  <div className="flex">
                    <p
                      style={{
                        color: "#60a5fa",
                        fontSize: "0.8rem",
                        // textAlign: "center",
                        cursor: "pointer",
                      }}
                      className="hover:underline mr-5"
                      onClick={() => setUploadImage((prev) => !prev)}
                    >
                      {image
                        ? image.name
                        : uploadImage
                          ? "Cancel"
                          : "Upload Image"}
                    </p>
                    {image && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                        className="hover:underline"
                        onClick={() => setImage(null)}
                      >
                        {"Remove Image"}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: "4.75rem",
                    height: "4.75rem",
                    backgroundColor: "rgba(0, 0, 0, 0.24)",
                    boxShadow: "var(--cl-shimmer-hover-shadow)",
                    transition: "box-shadow 280ms ease-out 0s",
                    marginRight: "2rem",
                    cursor: "pointer",
                  }}
                  className="w-1/3"
                >
                  {image ? (
                    preview && (
                      <Image
                        src={preview}
                        alt="Profile Picture"
                        width={100}
                        height={100}
                        className="rounded-full"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )
                  ) : user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile Picture"
                      width={100}
                      height={100}
                      className="rounded-full"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <AccountCircleIcon
                      style={{
                        maxWidth: "100%" as const,
                        width: "100%",
                        height: "auto",
                        display: "block",
                        verticalAlign: "middle",
                        overflowClipMargin: "content-box",
                        overflow: "clip",
                      }}
                    />
                  )}
                </div>
              </div>
            </DialogContent>

            {uploadImage && (
              <DialogContent>
                <DropzoneArea
                  filesLimit={1}
                  showFileNames
                  showPreviews
                  // useChipsForPreview
                  // onDrop={() => setUploadImage(false)}
                  acceptedFiles={["image/*"]}
                  dropzoneText={"Drag and drop an image here or click"}
                  // onChange={(files) => console.log("Files:", files)}
                  // onChange={(files) => {
                  //   setImage(files[0]);
                  //   // setUploadImage(false);
                  // }}
                  onDrop={(files: any) => {
                    setImage(files[0]);
                    setUploadImage(false);
                  }}
                />
              </DialogContent>
            )}

            <DialogActions>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleProfileChange}
                style={{
                  backgroundColor: "#172554",
                  color: "white",
                  fontSize: "0.8125rem",
                  fontWeight: "500",
                  padding: "8px 16px",
                  outline: "none",
                  border: "none",
                }}
              >
                Save
              </Button>
            </DialogActions>
            {errorMessage && (
              <p style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </p>
            )}
          </>
        )}

        {!changeEmail && !changePassword && !editProfile && (
          <>
            <DialogContent>
              <p
                style={{
                  color: "black",
                  margin: "0px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  lineHeight: "2",
                }}
              >
                Profile
              </p>
              <Divider style={{ margin: "1px 10px 17px 10px" }} />
              <div
                className="mb-10 flex hover:bg-gray-100 rounded-md p-2"
                onClick={handleProfileChangeToggle}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: "2.75rem",
                    height: "2.75rem",
                    backgroundColor: "rgba(0, 0, 0, 0.24)",
                    boxShadow: "var(--cl-shimmer-hover-shadow)",
                    transition: "box-shadow 280ms ease-out 0s",
                    marginRight: "2rem",
                    cursor: "pointer",
                  }}
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile Picture"
                      width={100}
                      height={100}
                      className="rounded-full"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <AccountCircleIcon
                      style={{
                        maxWidth: "100%" as const,
                        width: "100%",
                        height: "auto",
                        display: "block",
                        verticalAlign: "middle",
                        overflowClipMargin: "content-box",
                        overflow: "clip",
                      }}
                    />
                  )}
                </div>
                <div
                  className="flex flex-col"
                  style={{
                    alignItems: "center",
                    justifyItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      color: "black",
                      margin: "0px",
                      fontSize: "1rem",
                      // fontWeight: "700",
                      lineHeight: "2",
                      // alignItems: "center",
                      // alignSelf: "center",
                      // height: "fit-content",
                      // border: "1px solid red",
                      // border: "2px solid red",
                    }}
                  >
                    {user.displayName ? user.displayName : ""}
                  </p>
                  {(!user.displayName || !user.photoURL) && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{
                        border: "1px solid red",
                        textAlign: "center",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        color: "red",
                        height: "fit-content",
                      }}
                    >
                      PROFILE INCOMPLETE
                    </Typography>
                  )}
                </div>
              </div>

              <p
                style={{
                  color: "black",
                  margin: "0px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  lineHeight: "2",
                }}
              >
                Email Address
              </p>
              <Divider style={{ margin: "1px 10px 17px 10px" }} />
              <p
                style={{
                  color: "inherit",
                  margin: "0px",
                  marginLeft: "10px",
                  fontSize: "0.8125rem",
                  fontWeight: "400",
                  lineHeight: "1.25",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {user.email}
              </p>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEmailChangeToggle}
                style={{
                  outline: "none",
                  marginTop: "10px",
                  fontSize: "0.8125rem",
                  fontWeight: "500",
                  padding: "8px 16px",
                }}
              >
                <BorderColorIcon
                  style={{ fontSize: "0.8125rem", marginRight: "8px" }}
                />
                Change Email
              </Button>
            </DialogContent>
          </>
        )}

        {!changeEmail && !changePassword && !editProfile && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <DialogTitle>
                <div>
                  <h1
                    style={{
                      color: "black",
                      margin: "0px",
                      fontWeight: "600",
                      fontSize: "2rem",
                      lineHeight: "1.5",
                    }}
                  >
                    Security
                  </h1>
                  <p
                    style={{
                      color: "rgba(0, 0, 0, 0.65)",
                      margin: "0px",
                      fontSize: "1rem",
                      fontWeight: "400",
                      lineHeight: "1.25",
                    }}
                  >
                    Manage your security preferences
                  </p>
                </div>
              </DialogTitle>
            </div>

            <DialogContent>
              <div>
                <p
                  style={{
                    color: "black",
                    margin: "0px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    lineHeight: "2",
                  }}
                >
                  Password
                </p>
                <Divider style={{ margin: "1px 10px 17px 10px" }} />
                <p
                  style={{
                    color: "inherit",
                    margin: "0px",
                    marginLeft: "10px",
                    fontSize: "0.8125rem",
                    fontWeight: "400",
                    lineHeight: "1.25",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  ••••••••••
                </p>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlePasswordChangeToggle}
                  style={{
                    outline: "none",
                    marginTop: "10px",
                    fontSize: "0.8125rem",
                    fontWeight: "500",
                    padding: "8px 16px",
                  }}
                >
                  <BorderColorIcon
                    style={{ fontSize: "0.8125rem", marginRight: "8px" }}
                  />
                  Change Password
                </Button>
              </div>
              <div className="mt-10">
                <p
                  style={{
                    color: "black",
                    margin: "0px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    lineHeight: "2",
                  }}
                >
                  Delete Account
                </p>
                <Divider style={{ margin: "1px 10px 17px 10px" }} />
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  className="justify-between"
                >
                  <div className="flex flex-col">
                    <p
                      style={{
                        color: "inherit",
                        margin: "0px",
                        marginLeft: "10px",
                        fontSize: "0.8125rem",
                        fontWeight: "400",
                        lineHeight: "1.25",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        flex: "1", // Adjust the flex property
                      }}
                    >
                      Delete your account and all its associated data.
                    </p>
                    <TextField
                      className="w-full mt-4"
                      margin="dense"
                      id="password"
                      label="Enter Password to Confirm"
                      type="password"
                      fullWidth
                      value={password}
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleDeleteAccount}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      fontSize: "0.8125rem",
                      fontWeight: "500",
                      padding: "8px 16px",
                      outline: "none",
                      border: "none",
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
                {errorMessage && (
                  <p style={{ color: "red", textAlign: "center" }}>
                    {errorMessage}
                  </p>
                )}
              </div>
            </DialogContent>
          </>
        )}

        {changePassword && (
          <>
            <DialogContent>
              {/* TextFields for old password, new password, and confirm new password */}
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Old Password"
                type="password"
                value={oldPassword}
                autoComplete="off"
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="New Password"
                type="password"
                value={newPassword}
                autoComplete="off"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                autoComplete="off"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePasswordChange}
                style={{
                  backgroundColor: "#172554",
                  color: "white",
                  fontSize: "0.8125rem",
                  fontWeight: "500",
                  padding: "8px 16px",
                  outline: "none",
                  border: "none",
                }}
              >
                Save
              </Button>

              {/* show a span with red text color to render error message */}
            </DialogActions>
            {errorMessage && (
              <p style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p style={{ color: "green", textAlign: "center" }}>
                {successMessage}
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AccountInfoPopup;
