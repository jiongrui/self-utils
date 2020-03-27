// const date = require('../src/utils/date')
import { isValidDate, formatDate } from '../src/utils/date'

/* isValidDate 测试开始 */
// 有效日期格式
test('isValidDate(new Date("2019-1-2 21:1:23")) get true', () => {
    expect(isValidDate(new Date("2019-1-2 21:1:23"))).toBe(true)
})
test('isValidDate(new Date("2019/1/2 21:1:23")) get true', () => {
    expect(isValidDate(new Date("2019/1/2 21:1:23"))).toBe(true)
})

// 无效日期格式
test('isValidDate(new Date("20190102 21:1:23")) get false', () => {
    expect(isValidDate(new Date("20190102 21:1:23"))).toBe(false)
})

// 字符串
test('isValidDate("2019-1-2 21:1:23") get false', () => {
    expect(isValidDate("2019-1-2 21:1:23")).toBe(false)
})
/* isValidDate 测试结束 */

/* formatDate 测试开始 */
// 正常日期格式测试
test('formatDate 2019-1-2 21:1:23 yyyy-MM-dd get 2019-01-02', () => {
    expect(formatDate('2019-1-2 21:1:23', 'yyyy-MM-dd')).toBe('2019-01-02')
})
test('formatDate 2019-1-2 21:1:23 yyyy-MM-dd hh:mm:ss get 2019-01-02 21:01:23', () => {
    expect(formatDate('2019-1-2 21:1:23', 'yyyy-MM-dd hh:mm:ss')).toBe('2019-01-02 21:01:23')
})
test('formatDate 2019-1-2 21:1:23 yyyy-M-d h:m:s get 2019-1-2 21:1:23', () => {
    expect(formatDate('2019-1-2 21:1:23', 'yyyy-M-d h:m:s')).toBe('2019-1-2 21:1:23')
})
test('formatDate 2019-1-2 21:1:23 h:m:s get 21:1:23', () => {
    expect(formatDate('2019-1-2 21:1:23', 'h:m:s')).toBe('21:1:23')
})
test('formatDate 2019-1-2 21:1:23 yy/M get 19/1', () => {
    expect(formatDate('2019-1-2 21:1:23', 'yy/M')).toBe('19/1')
})

// 时间戳格式测试
test('formatDate 1546434083000 yyyy-MM-dd hh:mm:ss get 2019-01-02 21:01:23', () => {
    expect(formatDate(1546434083000, 'yyyy-MM-dd hh:mm:ss')).toBe('2019-01-02 21:01:23')
})
test('formatDate 1546434083000 yyyy-M-d h:m:s get 2019-1-2 21:1:23', () => {
    expect(formatDate(1546434083000, 'yyyy-M-d h:m:s')).toBe('2019-1-2 21:1:23')
})

// 字符串时间格式测试 
test('formatDate("2019-1-2 21:1:23", "yyyy-MM-dd hh:mm:ss") get 2019-01-02 21:01:23', () => {
    expect(formatDate("2019-1-2 21:1:23", "yyyy-MM-dd hh:mm:ss")).toBe('2019-01-02 21:01:23')
})
test('formatDate("2019-1-2 21:1:23", "yyyy-M-d h:m:s") get 2019-1-2 21:1:23', () => {
    expect(formatDate("2019-1-2 21:1:23", "yyyy-M-d h:m:s")).toBe('2019-1-2 21:1:23')
})

// 字符串非时间格式测试 
test('formatDate 20190102210123 yyyy-MM-dd hh:mm:ss get 2019-01-02 21:01:23', () => {
    expect(formatDate('20190102210123', 'yyyy-MM-dd hh:mm:ss')).toBe('2019-01-02 21:01:23')
})
test('formatDate 20190102210123 yyyy-M-d h:m:s get 2019-1-2 21:1:23', () => {
    expect(formatDate('20190102210123', 'yyyy-M-d h:m:s')).toBe('2019-1-2 21:1:23')
})

//不合约定参数测试
test('formatDate("", "yyyy-M-d h:m:s")  get --', () => {
    expect(formatDate("", "yyyy-M-d h:m:s")).toBe('--')
})
test('formatDate("", "")  get --', () => {
    expect(formatDate("", "")).toBe('--')
})
test('formatDate("")  get --', () => {
    expect(formatDate("")).toBe('--')
})
/* formatDate 测试结束 */