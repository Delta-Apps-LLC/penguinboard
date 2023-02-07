export default function ({ store, redirect }) {
    if (store.state.account.jwtUser == null || store.state.account.jwtUser == undefined) {
        return redirect("/login");
    }
}