export const state = () => ({
  userIdToken: null,
  OS: null,
  userProfile: null
})

export const mutations = {
  setUserIdToken(state, userIdToken) {
    state.userIdToken = userIdToken;
  },
  setOS(state, liff) {
    state.OS = liff.getOS();
  },
  setUserProfile(state, userProfile){
    state.userProfile = userProfile;
  }
}