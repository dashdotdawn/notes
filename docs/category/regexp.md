# 正则表达式
> 经常忘 记一下

字符 | 含义
--- | ---
. | 除换行符和其他 unicode 行终止符外的任意字符
\w | ASCII 字符 [a-zA-Z0-9_]
\W | 非
\s | unicode 空白符
\S | 非
\d | 数字 [0-9]
\D | 非 [^0-9]
{m, n} | >=m <=n 次
？| 0 或 1 次
* | 0 或多次
+ | 1 或多次
?? | 非贪婪匹配，?? , +? , *?
[...] | 方括号内的任意字符
[^...] | 非
\| | 选择，左边或右边
(...) | 组合
(?:...) | 组合，不记忆
\n | 引用，组索引按左括号计算
\b | 单词边界
\B | 非
(?=p) | 零宽正向断言，接下来字符匹配 p，不包括匹配字符在内
(?!p) | 零宽负向断言，接下来字符不匹配 p
i | 不区分大小写
m | 多行匹配，^ $ 可以匹配每一行
g | 全局匹配

g 的实际表现：
`String.prototype.match` 和 `RegExp.prototype.exec`
``` js
'dash dot dawn'.match(/\bd(a)\w*\b/)
// 返回一个包括首次匹配、捕获分组的数组，拥有 index 属性，标识匹配索引
> ["dash", "a", index: 0, input: "dash dot dawn", groups: undefined] 
'dash dot dawn'.match(/\bd(a)\w*\b/g)
// 返回所有匹配的数组
> ["dash", "dawn"]

// 每次执行 exec 的正则表示式都是重新构造的，因此返回结果一致
/\bd(a)\w*\b/g.exec('dash dot dawn')
> ["dash", "a", index: 0, input: "dash dot dawn", groups: undefined] 

const re = /\bd(a)\w*\b/g
re.global
> true
// re 会记录下次匹配开始的位置 lastIndex
re.exec('dash dot dawn')
> ["dash", "a", index: 0, input: "dash dot dawn", groups: undefined] 
re.lastIndex
> 4
re.exec('dash dot dawn')
> ["dawn", "a", index: 9, input: "dash dot dawn", groups: undefined]
re.lastIndex
> 13
re.exec('dash dot dawn')
> null
re.lastIndex
> 0
```

两个栗子
1. 强密码验证，要求包括大写字母、小写字母、数字、特殊符号、八个字符以上

/^(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z])(?!.*\n).*$/

2. 找出 var str = "python php ruby javascript jsonp perhapsphpisoutdated" 中包括 p 不包括 ph 的所有单词

str.match(/\b(?=\w*p)(?!\w*ph)\w*\b/g)
