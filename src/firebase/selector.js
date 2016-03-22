export default (state) => {
  const {authInfo: authInfoVal} = state.firebase;
  const authInfo = authInfoVal || {};
  let authProvider = authInfo.provider || ''
  return {
    ...state.firebase,
    authInfo,
    authProvider
  };
}