import { cookieHasValue, deleteAllCookies, deleteCookie, getCookieValue, setCookie } from './cookies-utils';

describe('Cookie utils', () => {
    afterEach(() => {
        deleteAllCookies();
    });
    describe('getCookieValue', () => {
        it('when document.cookie is empty', () => {
            expect(getCookieValue('username')).toBeUndefined();
        });
        it('return value of cookie', () => {
            const cookie = 'username=John Doe';
            document.cookie = cookie;
            expect(getCookieValue('username')).toEqual('John Doe');
        });
        it('return value of cookie when multiple cookies', () => {
            const cookie = 'username=John Doe';
            document.cookie = cookie;
            const cookie2 = 'cookie=delicious';
            document.cookie = cookie2;
            const cookie3 = 'random=blabla';
            document.cookie = cookie3;
            expect(getCookieValue('cookie')).toEqual('delicious');
        });
    });
    describe('setCookie', () => {
        it('set name and value', () => {
            setCookie({ name: 'cookie', value: 'delicious' });
            expect(document.cookie).toEqual('cookie=delicious');
        });
        it('set name, value, maxAge', () => {
            setCookie({ name: 'cookie', value: 'delicious', maxAge: 10 * 60 });
            expect(document.cookie).toEqual('cookie=delicious');
        });
        it('set name, value, expires', () => {
            setCookie({ name: 'cookie', value: 'delicious', expires: new Date(9999, 10, 1) });
            expect(document.cookie).toEqual('cookie=delicious');
        });
        it('set name, value, path', () => {
            setCookie({ name: 'cookie', value: 'delicious', path: '/' });
            expect(document.cookie).toEqual('cookie=delicious');
        });
        it('set name, value, domain', () => {
            setCookie({ name: 'cookie', value: 'delicious', domain: 'domain.com' });
            expect(document.cookie).toEqual('');
        });
        it('set name, value, secure', () => {
            setCookie({ name: 'cookie', value: 'delicious', secure: true });
            expect(document.cookie).toEqual('');
        });
        it.each([
            ['none'],
            ['lax'],
            ['strict'],
        ] as const)('set name, value, sameSite:%s', sameSite => {
            setCookie({ name: 'cookie', value: 'delicious', sameSite });
            expect(document.cookie).toEqual('cookie=delicious');
        });
    });

    describe('deleteCookie', () => {
        it('should not delete cookie if it doesnt exist', () => {
            const cookie = 'username=John Doe';
            document.cookie = cookie;
            deleteCookie('name');
            expect(document.cookie).toEqual(cookie);
        });
        it.each([
            ['without attributes', 'username=John Doe'],
            ['with an expiry date', 'username=John Doe; expires=Fri, 31 Dec 9999 23:59:59 GMT'],
            ['with a max age', 'username=John Doe;max-age=31536000'],
            ['with a path', 'username=John Doe;path=/mydir'],
            ['with a domain', 'username=John Doe;domain=domain.example.com'],
        ])('should delete cookie if it exists %s', (_description, cookie) => {
            document.cookie = cookie;
            deleteCookie('username');
            expect(document.cookie).toEqual('');
        });
    });

    describe('cookieHasValue', () => {
        it('should return true if cookie has expected value', () => {
            const cookie = 'username=John Doe';
            document.cookie = cookie;
            expect(cookieHasValue('username', 'John Doe')).toBeTruthy();
        });
        it('should return false if cookie doesnt have expected value', () => {
            const cookie = 'username=John Doe';
            document.cookie = cookie;
            expect(cookieHasValue('username', 'Johny')).toBeFalsy();
        });
        it('should return false if cookie doesnt exist', () => {
            const cookie = 'username=John Doe';
            document.cookie = cookie;
            expect(cookieHasValue('notfound', 'Johny')).toBeFalsy();
        });
    });
});
