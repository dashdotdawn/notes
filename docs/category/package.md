# package.json

## dependencies 中的版本号

### 说明
Major.Minor.Patch === 主版本号.次版本号.修订号

[semer](https://docs.npmjs.com/misc/semver)
- version Must match version exactly
- \>version Must be greater than version
- \>=version etc
- <version
- <=version
- ~version "Approximately equivalent to version" See semver
- ^version "Compatible with version" See semver
- 1.2.x 1.2.0, 1.2.1, etc., but not 1.3.0
- http://... See 'URLs as Dependencies' below
- \* Matches any version
- "" (just an empty string) Same as *
- version1 - version2 Same as >=version1 <=version2.
- range1 || range2 Passes if either range1 or range2 are satisfied.
- git... See 'Git URLs as Dependencies' below
- user/repo See 'GitHub URLs' below
- tag A specific version tagged and published as tag See npm-dist-tag
- path/path/path See Local Paths below

### 栗子
~: A.B.C，B != 0 安装 A.B.x 的最新版本，B == 0 安装 A.x 最新版本
1. ~1.2.3 即 >= 1.2.3 < 1.3.0
2. ~1.2 即 >= 1.2.0 < 1.3.0
3. ~1 即 >= 1.0.0 < 2.0.0
4. ~0.2.3 即 >= 0.2.3 < 0.3.0
5. ~0.2 即 >= 0.2.0 < 0.3.0
6. ~0 即 >= 0.0.0 < 1.0.0
7. ~1.2 即 >= 1.2.0 < 1.3.0

^: A.B.C，不改动左数第一个非零版本号
1. ^1.2.3 即 >=1.2.3 <2.0.0
2. ^0.2.3 即 >=0.2.3 <0.3.0
3. ^0.0.3 即 >=0.0.3 <0.0.4
4. ^1.2.x := >=1.2.0 <2.0.0
5. ^0.0.x := >=0.0.0 <0.1.0
6. ^0.0 := >=0.0.0 <0.1.0

## TODO
package-lock.json 区别
