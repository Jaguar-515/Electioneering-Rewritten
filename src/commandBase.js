class command {
    constructor(func_) {
        this.func_ = func_
    }

    execute(msg) {
        this.func_(msg)
    }
}

exports.commandBase = command