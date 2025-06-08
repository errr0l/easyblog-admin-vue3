export const paginationMixin = {
    data() {
        return {
            methodName: '',
            query: {
                size: 10,
                current: 1
            },
        }
    },
    methods: {
        _getPagination() {
            if (this.methodName && typeof this[this.methodName] === 'function') {
                this[this.methodName]();
            }
            else if (typeof this.getPagination === 'function') {
                this.getPagination();
            }
        },
        currentChange(current) {
            this.query.current = current;
            this._getPagination();
        }
    }
};