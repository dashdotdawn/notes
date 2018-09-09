# nginx
## 记一次智障错误排查

``` bash
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8888 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:4321 failed (48: Address already in use)
```

改了 servers 里面的配置，nginx -s reload 之后执行了 nginx 报了这个错。我居然还去 google 了……

原因

``` bash
ps ax | grep nginx

58065   ??  Ss     0:00.01 nginx: master process nginx
94086   ??  S      0:00.00 nginx: worker process
94280 s004  S+     0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn nginx
```
人家早就在跑了🙂
