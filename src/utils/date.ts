
export function isValidDate(date: any): boolean {
    if (Object.prototype.toString.call(date) === '[object Date]') {
        // it is a date
        if (isNaN(date.getTime())) {
            // d.valueOf() could also work
            return false // date is not valid
        }

        return true // date is valid
    }

    // not a date
    return false
}

function format(date: Date, fmt: string): string {
    if (!isValidDate(date)) {
        return '--'
    }

    const o: { [a: string]: number } = {
        '(M+)': date.getMonth() + 1,
        '(d+)': date.getDate(),
        '(h+)': date.getHours(),
        '(m+)': date.getMinutes(),
        '(s+)': date.getSeconds()
    }

    if (new RegExp(/(y+)/).exec(fmt)) {
        const year = date.getFullYear() + ''
        const result = RegExp.$1
        fmt = fmt.replace(result, year.substring(4 - result.length))
    }

    for (const k in o) {
        const reg = new RegExp(k)
        if (reg.exec(fmt)) {
            const result = RegExp.$1
            fmt = fmt.replace(result, (o[k] + '').padStart(result.length, '0'))
        }
    }
    return fmt
}

export function formatDate(date: Date | number | string, fmt?: string): string {
    fmt = fmt || 'yyyy-MM-dd'

    if (!date) {
        return '--'
    } else if (typeof date === 'number') {
        date = new Date(date)
    } else if (typeof date === 'string') {
        const dateStr = date
        date = new Date(date)

        // 无效时间格式
        if (!isValidDate(date)) {
            let y, M, d, h, m, s
            y = M = d = h = m = s = 0
            if (!isNaN(Number(dateStr)) && dateStr.length >= 8) {
                y = dateStr.substring(0, 4)
                M = dateStr.substring(4, 6)
                d = dateStr.substring(6, 8)
                h = dateStr.substring(8, 10) || 0
                m = dateStr.substring(10, 12) || 0
                s = dateStr.substring(12, 14) || 0
                date = new Date(`${y}-${M}-${d} ${h}:${m}:${s}`)
            } else {
                return '--'
            }
        }
    }

    return format(date, fmt)
}
