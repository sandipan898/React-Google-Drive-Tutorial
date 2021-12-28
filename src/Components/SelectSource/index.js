import React, { useState, useEffect } from 'react';

import useDrivePicker from 'react-google-drive-picker'
import { gapi } from 'gapi-script';
 
import { Row, Col, Spin, Select } from 'antd';
import styled from 'styled-components';
import GoogleDriveImage from '../../assets/images/google-drive.png';
import ListDocuments from '../ListDocuments';
import { style } from './styles';
import { loadGoogleScript } from '../helper';

const NewDocumentWrapper = styled.div`
  ${style}
`;

// // Client ID and API key from the Developer Console
const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;
const appId = process.env.APP_ID;

// // Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
// const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file'];
// const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const SCOPES = 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file';

const SelectSource = () => {
  const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
  const [signedInUser, setSignedInUser] = useState({});
  const [oauthToken, setOauthToken] = useState();
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const handleChange = (file) => {};

  useEffect(() => {
    if (Object.keys(signedInUser).length) {
      console.log('signedInUser', signedInUser);
      handleSignOutClick();
    }
  });

  const listFiles = (searchTerm = null) => {
    setIsFetchingGoogleDriveFiles(true);
    gapi.client.drive.files
      .list({
        pageSize: 100,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
        q: searchTerm,
      })
      .then(function (response) {
        setIsFetchingGoogleDriveFiles(false);
        setListDocumentsVisibility(true);
        const res = JSON.parse(response.body);
        setDocuments(res.files);
        console.log('Files', res.files);
      });
  };

  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const updateSigninStatus = (isSignedIn) => {
    // console.log('SigninStatus:', isSignedIn);
    if (isSignedIn) {
      // Set the signed in user
      console.log(gapi.auth2.getAuthInstance().currentUser);
      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
      setIsLoadingGoogleDriveApi(false);
      // list files if user is authenticated
      // listFiles("mimeType=application/vnd.google-apps.folder'");
      handleOpenPicker();
    } else {
      // prompt user to sign in
      handleAuthClick();
    }
  };

  const handleSignOutClick = (event = {}) => {
    console.log('Signing out');
    setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();
    setSignedInUser({});
  };

  const initClient = () => {
    setIsLoadingGoogleDriveApi(true);
    console.log('Initiating');
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        // redirect_uri: ''
      })
      .then(
        function () {
          console.log('Fetching documents', gapi);
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {
          console.log('error', error);
        }
      )
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
    // gapi.load('picker', onPickerApiLoad);
  };

  const showDocuments = () => {
    setListDocumentsVisibility(true);
  };

  const onClose = () => {
    setListDocumentsVisibility(false);
  };

  const [openPicker, data, authResponse] = useDrivePicker();  
  
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
      customScopes: SCOPES,
      // customViews: customViewsArray, // custom view
    })
  }

  useEffect(() => {
    // do anything with the selected/uploaded files
    console.log("authResponse", authResponse);
    if(data){
      console.log(data)
      data.docs.map(folder => {
        console.log(folder);
        // fetchFiles(folder.id)
        listFiles(`mimeType=application/vnd.google-apps.folder'&parents=${folder.id}`);
      })
    }
  }, [data]);

  return (
    <NewDocumentWrapper>
      <Row gutter={16} className="custom-row">
        <ListDocuments
          visible={listDocumentsVisible}
          onClose={onClose}
          documents={documents}
          onSearch={listFiles}
          signedInUser={signedInUser}
          onSignOut={handleSignOutClick}
          isLoading={isFetchingGoogleDriveFiles}
        />
        <Col span={8}>
          <Spin spinning={isLoadingGoogleDriveApi} style={{ width: '100%' }}>
            <div onClick={() => handleClientLoad()} className="source-container">
              <div className="icon-container">
                <div className="icon icon-success">
                  <img height="80" width="80" src={GoogleDriveImage} />
                </div>
              </div>
              <div className="content-container">
                <p className="title">Google Drive</p>
                <span className="content">Import documents straight from your google drive</span>
              </div>
            </div>
          </Spin>
        </Col>
      </Row>
    </NewDocumentWrapper>
  );
};

export default SelectSource;

// function App() {
//   const [openPicker, data, authResponse] = useDrivePicker();  
//   // const customViewsArray = [new google.picker.DocsView()]; // custom view
//   const handleOpenPicker = () => {
//     openPicker({
//       clientId: CLIENT_ID,
//       developerKey: API_KEY,
//       viewId: "FOLDERS",
//       // token: token, // pass oauth token in case you already have one
//       showUploadView: false,
//       showUploadFolders: false,
//       supportDrives: true,
//       multiselect: true,
//       setSelectFolderEnabled: true,
//       customScopes: SCOPES,
//       // customViews: customViewsArray, // custom view
//     })
//   }

//   // useEffect(() => {
//   //   console.log("authResponse", authResponse);
//   // }, [])
 
//   useEffect(() => {
//     // do anything with the selected/uploaded files
//     console.log("authResponse", authResponse);
//     if(data){
//       console.log(data)
//       data.docs.map(folder => {
//         console.log(folder);
//         // fetchFiles(folder.id)
//       })
//     }
//   }, [data]);
  
//   const fetchFiles = (folderId) => {
//     fetch(`https://www.googleapis.com/drive/v3/files`, {
//       q: `'${folderId}' in parents`,
//       key: API_KEY
//     })
//     // fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}`,{})
//       .then((res)=> {
//         console.log(res);
//       })
//       .catch((err)=>console.log(err))
//   }
//   return (
//     <div>
//         <button onClick={() => handleOpenPicker()}>Select Folders</button>
//     </div>
//   );
// }
 
// export default App;