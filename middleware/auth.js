export default function ({ store, redirect }) {
    if (store.state.account.user === null || store.state.account.user === undefined) {
        return redirect("/login");
    }
}