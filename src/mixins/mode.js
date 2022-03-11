import store from "@/store";

let mode = {
    methods: {
        mode(className) {
            if (store.state.setting.darkMode)
                return `bg-secondary text-textSecondary ${className}`
            return `bg-white border-b ${className}`
        }
    }
}

export default mode;