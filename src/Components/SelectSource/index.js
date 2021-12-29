import React, { useState, useEffect } from 'react';

import useDrivePicker from 'react-google-drive-picker'
import { gapi } from 'gapi-script';

import { Row, Col, Spin, Select } from 'antd';
import styled from 'styled-components';
import GoogleDriveImage from '../../assets/images/google-drive.png';
import ListDocuments from '../ListDocuments';
import { style } from './styles';
import { loadGoogleScript } from '../helper';
import { getFileInfo } from 'prettier';
import * as AWS from "aws-sdk";

const NewDocumentWrapper = styled.div`
  ${style}
`;

// // Client ID and API key from the Developer Console
// const CLIENT_ID = process.env.CLIENT_ID;
// const API_KEY = process.env.API_KEY;
// const appId = process.env.APP_ID;
const CLIENT_ID = "546959051313-8l13pmvrkm4tfv8fcqdghs2uj6a354t5.apps.googleusercontent.com";
const API_KEY = "AIzaSyD7ySMiIUkaq7MakjjDcbeEVQTF9WEIsbg";
const appId = "546959051313";

// // Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
const SCOPES2 = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata'];
// const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const SCOPES = 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata';

// const SelectSource = () => {
//   const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
//   const [documents, setDocuments] = useState([]);
//   const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
//   const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
//   const [signedInUser, setSignedInUser] = useState({});
//   const [oauthToken, setOauthToken] = useState();
//   const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
//   const handleChange = (file) => {};

//   const [openPicker, data] = useDrivePicker();  

//   useEffect(() => {
//     if (Object.keys(signedInUser).length) {
//       console.log('signedInUser', signedInUser);
//       handleSignOutClick();
//     }
//   });

//   // useEffect(() => {
//   //   // do anything with the selected/uploaded files
//   //   console.log("authResponse");
//   //   if(data){
//   //     console.log(data)
//   //     data.docs.map(folder => {
//   //       console.log(folder);
//   //       // fetchFiles(folder.id)
//   //       listFiles(`parents=${folder.id}`);
//   //     })
//   //   }
//   // }, [data]);

//   // useEffect(() => {
//   //   // const folders = documents.filter((doc)=> doc.mimeType === "application/vnd.google-apps.folder")
//   //   console.log("Folders", documents[0])
//   //   if (documents.length) {
//   //     gapi.client.drive.files
//   //     .list({
//   //       // pageSize: 10,
//   //       fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
//   //       // q: `parents=${documents[0].id}`,
//   //       q: `'${documents[0].id}' in parents`,
//   //     })
//   //     .then((response) => {
//   //       const res = JSON.parse(response.body);
//   //       console.log('Contents', res);
//   //     })
//   //     .catch((err) => console.log("err", err));
//   //   }
//   // }, [documents])

//   const handleClientLoad = () => {
//     // handleOpenPicker()
//     gapi.load('client:auth2', initClient);
//     // gapi.load('picker', onPickerApiLoad);
//   };

//   const initClient = () => {
//     setIsLoadingGoogleDriveApi(true);
//     console.log('Initiating');
//     gapi.client
//       .init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         discoveryDocs: DISCOVERY_DOCS,
//         scope: SCOPES,
//         // redirect_uri: ''
//       })
//       .then(
//         function () {
//           console.log('Fetching documents', gapi);
//           // Listen for sign-in state changes.
//           gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
//           // Handle the initial sign-in state.
//           updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//         },
//         function (error) {
//           console.log('error', error);
//         }
//       )
//       .catch((err) => {
//         console.log('err', err);
//       });
//   };

//   const handleAuthClick = (event) => {
//     gapi.auth2.getAuthInstance().signIn();
//   };

//   const updateSigninStatus = (isSignedIn) => {
//     // console.log('SigninStatus:', isSignedIn);
//     if (isSignedIn) {
//       // Set the signed in user
//       // console.log(gapi.auth.getToken())
//       setOauthToken(gapi.auth.getToken().access_token)
//       setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
//       setIsLoadingGoogleDriveApi(false);
//       listFiles();
//       // retrieveAllFiles()
//       // listFiles("mimeType=application/vnd.google-apps.folder");
//       // handleOpenPicker();
//     } else {
//       // prompt user to sign in
//       handleAuthClick();
//     }
//   };

//   const handleSignOutClick = (event = {}) => {
//     console.log('Signing out');
//     setListDocumentsVisibility(false);
//     gapi.auth2.getAuthInstance().signOut();
//     setSignedInUser({});
//   };

//   const showDocuments = () => {
//     setListDocumentsVisibility(true);
//   };

//   const onClose = () => {
//     setListDocumentsVisibility(false);
//   };

//   const listFiles = (searchTerm = "mimeType='application/vnd.google-apps.folder'"  ) => {
//     setIsFetchingGoogleDriveFiles(true);
//     gapi.client.drive.files
//       .list({
//         pageSize: 100,
//         fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
//         q: searchTerm,
//       })
//       .then((response) => {
//         setIsFetchingGoogleDriveFiles(false);
//         setListDocumentsVisibility(true);
//         const res = JSON.parse(response.body);
//         setDocuments(res.files);
//         console.log('Files', res);
//       })
//   };

//   // function retrieveAllFiles(callback) {
//   //   var retrievePageOfFiles = function(request, result) {
//   //     request.execute(function(resp) {
//   //       result = result.concat(resp.items);
//   //       var nextPageToken = resp.nextPageToken;
//   //       if (nextPageToken) {
//   //         request = gapi.client.drive.files.list({
//   //           'pageToken': nextPageToken
//   //         });
//   //         retrievePageOfFiles(request, result);
//   //       } else {
//   //         callback(result);
//   //       }
//   //     });
//   //   }
//   //   var initialRequest = gapi.client.drive.files.list();
//   //   retrievePageOfFiles(initialRequest, []);
//   // }

//   const handleOpenPicker = () => {
//     console.log("openning picker")
//     openPicker({
//       clientId: CLIENT_ID,
//       developerKey: API_KEY,
//       viewId: "FOLDERS",
//       token: oauthToken,
//       showUploadView: false,
//       showUploadFolders: false,
//       supportDrives: true,
//       multiselect: true,
//       setSelectFolderEnabled: true,
//       customScopes: SCOPES2,
//       // customViews: customViewsArray, // custom view
//     })
//   }

//   return (
//     <NewDocumentWrapper>
//       <Row gutter={16} className="custom-row">
//         <ListDocuments
//           visible={listDocumentsVisible}
//           onClose={onClose}
//           documents={documents}
//           onSearch={listFiles}
//           signedInUser={signedInUser}
//           onSignOut={handleSignOutClick}
//           isLoading={isFetchingGoogleDriveFiles}
//         />
//         <Col span={8}>
//           <Spin spinning={isLoadingGoogleDriveApi} style={{ width: '100%' }}>
//             <div onClick={() => handleClientLoad()} className="source-container">
//               <div className="icon-container">
//                 <div className="icon icon-success">
//                   <img height="80" width="80" src={GoogleDriveImage} />
//                 </div>
//               </div>
//               <div className="content-container">
//                 <p className="title">Google Drive</p>
//                 <span className="content">Import documents straight from your google drive</span>
//               </div>
//             </div>
//           </Spin>
//         </Col>
//       </Row>
//     </NewDocumentWrapper>
//   );
// };

// export default SelectSource;

function App() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [documents, setDocuments] = useState([]);
  const [signedInUser, setSignedInUser] = useState({});
  const [childFiles, setChildFiles] = useState([]);

  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: CLIENT_ID,
      developerKey: API_KEY,
      viewId: "FOLDERS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: true,
      setSelectFolderEnabled: true,
      customScopes: SCOPES2,
      // customViews: customViewsArray, // custom view
    })
  }

  useEffect(() => {
    // do anything with the selected/uploaded files
    console.log("authResponse", authResponse);
    if (data) {
      console.log(data)
      handleClientLoad(data) // needs to complete first / asynchronous
      
      // data.docs.forEach(folder => {
      //   console.log(folder);
      //   fetchFiles(folder.id) // needs to complete / asynchronous
      // })
      // handleSuccess()
      console.log("handleSuccess", childFiles);
    }
  }, [data]);

  const handleClientLoad = (data) => {
    // handleOpenPicker()
    gapi.load('client:auth2', initClient);
    // gapi.load('picker', onPickerApiLoad);
  };

  const initClient = () => {
    // setIsLoadingGoogleDriveApi(true);
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        // redirect_uri: ''
      })
      .then(
        function () {
          console.log('Fetching documents', gapi, data);
          // Listen for sign-in state changes.
          gapi.auth.setToken(authResponse.access_token)
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          
          data.docs.forEach(folder => {
            console.log(folder);
            fetchFiles(folder.id) // needs to complete / asynchronous
          })
        },
        function (error) {
          console.log('error', error);
        }
      )
      .catch((err) => {
        console.log('err', err);
      });
  };

  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      // setOauthToken(gapi.auth.getToken().access_token)
      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
      // listFiles();
    } else {
      // prompt user to sign in
      handleAuthClick();
    }
  };

  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const fetchFiles = (folderId) => {
    // fetch(`https://www.googleapis.com/drive/v3/files`, {
    //   q: `'${folderId}' in parents`,
    //   key: API_KEY
    // })
    // fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}`,{})
    fetch(`https://www.googleapis.com/drive/v2/files/${folderId}/children?key=${API_KEY}`, {
      method: "GET",
      mode: 'cors', // no-cors, *cors, same-origin
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Authorization': 'Bearer ' + authResponse.access_token,
        'Accept': 'application/json'
      },
    })
      .then(res => res.json())
      .then(data => {
        let fileArr = [];
        data.items.forEach(files => fileArr.push(getFileInfo(files.id)))
        Promise.all(fileArr)
        .then((res) => {
          console.log("res", res)
          handleSuccess(res)
        })
      })
      .catch(err => console.log(err))
      console.log("handleSuccess", childFiles);      
  }

  const getFileInfo = async (fileId) => {
    const response = await gapi.client.drive.files.get({
      'fileId': fileId,
      // 'alt': 'media'
      fields: 'id, name, mimeType, modifiedTime, webViewLink, webContentLink, fullFileExtension, fileExtension',
    })
    const resp = JSON.parse(response.body);
    return resp;
      // .then((response) => {
        // let filesArr = childFiles;
        // filesArr.push(resp);
        // console.log("childFiles", childFiles)
        // setChildFiles(filesArr);
        // handleSuccess(resp);
        // uploadFileToS3(resp, resp.webViewLink, "qdox-training-pipeline", "google-drive-test/" + resp.name)
      // });
  }


  const [allLinks, setAllLinks] = useState([]);
  const [loader, setLoader] = useState(false);

  AWS.config.region = "us-east-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:9b9e38cd-3ae5-4c5a-9636-d247dc100b7b"
  });

  const uploadFileToS3 = (file, url, bucket, key) => {
    return fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        // 'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Headers' : 'Origin, Content-Type, Accept'
      },
      referrer: "no-referrer"
    })
      .then((x) => x.blob())
      .then((response) => {
        console.log("response >> ", response);
        // const params = {
        //   ContentType: response.type,
        //   ContentLength: response.size.toString(), // or response.header["content-length"] if available for the type of file downloaded
        //   Bucket: bucket,
        //   Body: response,
        //   Key: key
        // };
        // console.log("params >> ", params)
        // const s3 = new AWS.S3();
        // return s3.putObject(params).promise();
      })
      .catch((err) => {
        console.log("error fetching file from url ", err);
      });
  };

  function handleSuccess(files) {
    console.log("files >> ", files);
    let promiseArray = [];
    let allLinks = [];
    setLoader(true);
    files.forEach((file) => {
        allLinks.push(file);
        promiseArray.push(
          uploadFileToS3(
            file,
            file.webViewLink,
            // file.webContentLink,
            "qdox-training-pipeline",
            "google-drive-test/" + file.name
          )
        );
    });

    setAllLinks(allLinks);
    Promise.all(promiseArray)
      .then((res) => {
        setLoader(false);
        console.log("all the files uploaded successfully !!");
      })
      .catch((err) => {
        setLoader(false);
        console.log("some error in uploading files");
      });
  }

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Select Folders</button>
    </div>
  );
}

export default App;