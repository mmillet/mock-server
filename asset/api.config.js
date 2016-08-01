const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

module.exports = {
  lastModify: '2016-07-05',
  prefix: '/api',
  desc: "信用卡接口描述",
  groups: [
    {
      name: 'PC_WAP',
      data: [ // PC&WAP用户访问的页面接口
        {
          url: '/credit/categories',
          desc: '获取信用卡一二级分类, 和cms共用该接口',
          method: METHOD.GET,
          res: {
            items: [
              {
                label: 'Featured Cards', // 分类名称
                value: '01' // 分类唯一值,对应url
              },
              {
                label: 'Travel',
                value: '02',
                children: [  // 二级子分类
                  {
                    label: 'Airline',
                    value: '0201'
                  },
                  {
                    label: 'Hotel',
                    value: '0202'
                  },
                  {
                    label: 'No Foreign Transaction Fee',
                    value: '0203'
                  }
                ]
              },
              {
                label: 'Rewards',
                value: '03',
                children: [
                  {
                    label: 'Rewards',
                    value: '0301'
                  },
                  {
                    label: 'Cash Back',
                    value: '0302'
                  },
                  {
                    label: 'Points',
                    value: '0303'
                  },
                  {
                    label: 'Gas',
                    value: '0304'
                  }
                ]
              },
              {
                label: 'Low Fees',
                value: '04',
                children: [
                  {
                    label: 'No Annual Fee',
                    value: '0401'
                  },
                  {
                    label: 'No Foreign Transaction Fee',
                    value: '0402'
                  }
                ]
              },
              {
                label: 'By Issuer',
                value: '05',
                children: [
                  {
                    label: 'Visa',
                    value: '0501'
                  },
                  {
                    label: 'MasterCard',
                    value: '0502'
                  },
                  {
                    label: 'Citi',
                    value: '0503'
                  },
                  {
                    label: 'Chase',
                    value: '0504'
                  },
                  {
                    label: 'American Express',
                    value: '0505'
                  },
                  {
                    label: 'Discover',
                    value: '0506'
                  }
                ]
              },
              {
                label: 'Student',
                value: '06'
              },
              {
                label: 'Small Business',
                value: '07'
              },
              {
                label: 'Others',
                value: '08',
                children: [
                  {
                    label: 'Balance Transfer',
                    value: '0801'
                  },
                  {
                    label: '0% APR',
                    value: '0802'
                  },
                  {
                    label: 'Low Interest',
                    value: '0803'
                  },
                  {
                    label: 'Bad, Limited, or No Credit History',
                    value: '0804'
                  }
                ]
              }
            ]
          }
        },
        {
          url: '/credit/recommend',
          desc: '获取推荐卡片(feature cards),用于轮播',
          method: METHOD.GET,

          req: {
            exclude: '@integer(10000, 99999)' // 不包含某当卡的id
          },

          res: {
            'items|9': [
              {
                name: '@title(2, 6)', // 信用卡名称
                id: '@integer(10000, 99999)', // 信用卡ID
                image: '@image("200x100", "#50B347", "#FFF", "Credit Card")' // 信用卡图片
              }
            ]
          }
        },
        {
          url: '/credit/cards/category/:category/page/:page',
          method: METHOD.GET,
          desc: '获取分类下面的列表数据, /credit/cards/category/:分类名/page/:分页数',
          res: {
            pageIndex: '@integer(0, 9)', // 当前页数,从0开始
            pageTotal: 10, // 总页数
            'items|25': [ // 每页数量25,前端下拉加载
              {
                image: '@image("200x100", "#50B347", "#FFF", "Credit Card")', // 信用卡图片
                applyUrl: '@url', // 申请地址
                ratesFeesUrl: '@url', // Rates & Fees URL
                highlightName: '@title(2, 6)', // 信用卡顶部红色标注的名称
                name: '@title(2, 6)', // 信用卡名称
                id: '@integer(10000, 99999)', // 信用卡ID
                expandBulletPoints: '@boolean', // 是否展开BulletPoints
                'bulletPoints|3-10': [ // 信用卡介绍
                  '@sentence(5, 15)'
                ],
                'briefPoints|3': [ // 信用卡底部简单介绍,最少3条
                  {
                    label: '@title(1, 2)', // 介绍标题
                    content: '@sentence(5, 15)' // 内容
                  }
                ]
              }
            ]
          }
        },
        {
          url: '/credit/card/:id/category/:category',
          method: METHOD.GET,
          desc: '获取信用卡详情,传入category id和信用卡ID',
          res: {
            'affiliate|2': [ // 信用卡所属的一二级分类,用户生成面包屑和高亮分类
              {
                label: '@title(1, 2)',
                value: '@word(2, 5)_@word(2, 5)'
              }
            ],
            image: '@image("200x100", "#50B347", "#FFF", "Credit Card")', // 信用卡图片
            applyUrl: '@url', // 申请地址
            ratesFeesUrl: '@url', // Rates & Fees URL
            highlightName: '@title(2, 6)', // 信用卡顶部红色标注的名称
            name: '@title(2, 6)', // 信用卡名称
            id: '@integer(10000, 99999)', // 信用卡ID
            'bulletPoints|3-10': [ // 信用卡介绍
              '@sentence(5, 15)'
            ],
            'briefPoints|3': [ // 信用卡底部简单介绍,3条
              {
                label: '@word(4)', // 介绍标题
                content: '@sentence(5, 15)' // 内容
              }
            ]
          }
        },
        {
          url: '/credit/ads',
          desc: '获取广告列表,和cms共用该接口',
          method: METHOD.GET,
          req: {
            keywords: '@word'
          },
          res: {
            'items|1-3': [
              {
                url: '@url', // 广告地址
                image: '@image("400x400", "#50B347", "#FFF", "Ad")' // 广告图片
              }
            ]
          }
        }
      ]
    },
    {
      name: 'CMS',
      data: [ // 管理后台CMS接口
        {
          url: '/cms/credit/categories',
          forward: '/credit/categories'
        },
        {
          url: '/cms/credit/image',
          desc: 'CMS上传图片',
          method: METHOD.POST,
          req: {
            file: '@file'
          },
          res: {
            image: '@image("400x400", "#50B347", "#FFF", "Image")' // 图片链接
          }
        },
        {
          url: '/cms/credit/cards/category/:category/page/:page',
          desc: 'CMS获取分类下的信用卡,如果是所有卡片category传空',
          method: METHOD.GET,

          req: {
            keywords: '@word(5)', // 信用卡搜索
            getAll: '@boolean', // 如果为true将不分页, items字段将存放所有卡片
            orderBy: '-id|name' // 按id或name排序,如果是逆序,加-号在前面
          },
          res: {
            pageIndex: '@integer(0, 9)', // 当前页数,从0开始
            pageTotal: 10, // 总页数
            'items|25': [ // 每页数量25,前端下拉加载
              {
                id: '@integer(10000, 99999)', // 卡片ID(序号)
                image: '@image("200x100", "#50B347", "#FFF", "Credit Card")', // 信用卡图片
                name: '@title(2, 6)', // 信用卡名称
                expandBulletPoints: '@boolean', // 是否展开Bullet Points
                highlightName: '@title(2, 5)', // 高亮名称,推荐文案
                'briefPoints|3': [
                  {
                    point: 'bonus',
                    enabled: '@boolean'
                  },
                  {
                    point: 'rewards',
                    enabled: '@boolean'
                  },
                  {
                    point: 'highlights',
                    enabled: '@boolean'
                  },
                  {
                    point: 'cashBack',
                    enabled: '@boolean'
                  },
                  {
                    point: 'introApr',
                    enabled: '@boolean'
                  },
                  {
                    point: 'period',
                    enabled: '@boolean'
                  },
                  {
                    point: 'annualFee',
                    enabled: '@boolean'
                  }
                ], // 呈现在页面底部的points
                isManual: '@boolean', // 是否是手动填写的
                isActive: '@boolean', // 是否启用
                isValid: '@boolean', //  卡片信息是否完整
                lastUpdatedTime: '@datetime()', // 最后更新或抓取时间
                'categories|2-5': ['@title(1, 2)'] // 所属分类名,在展示所有卡片的时候会用到
              }
            ]
          }
        },
        {
          url: '/cms/credit/card/:id',
          desc: '获取卡片的详情,用于编辑',
          method: METHOD.GET,
          res: {
            id: '@integer(10000, 99999)', // 卡片id

            isManual: '@boolean', // 是否是手动填写
            grabId: '@word', // 如果是自动抓取,传递抓取卡片ID

            name: '@title(2, 5)', // 卡片名称
            image: '@url', // 卡片图片url,可能是一个相对路径
            applyUrl: '@url', // 卡片申请地址
            bank: '@word(4)', // 发卡银行
            issuer:  '@word(5)', // 发卡商

            ratesFeesUrl: '@url', // Rates & Fees URL

            'bulletPoints|3-10': [ // Bullet Points
              '@sentence(5, 10)'
            ],

            // 其他描述,会有3个值
            briefPoints: [
              {
                point: 'bonus',
                content: '@sentence(5,10)'
              },
              {
                point: 'rewards',
                content: '@sentence(5,10)'
              },
              {
                point: 'highlights',
                content: '@sentence(5,10)'
              },
              {
                point: 'cashBack',
                content: '@sentence(5,10)'
              },
              {
                point: 'introApr',
                content: 'sentence(5, 10)'
              },
              {
                point: 'introApr',
                content: '@sentence(5,10)'
              },
              {
                point: 'annualFee',
                content: '@sentence(5,10)'
              }
            ]
          }
        },
        {
          url: '/cms/credit/card/:id',
          desc: '新增|更新|删除卡片,如果是更新或删除会带id',
          method: [METHOD.POST, METHOD.PUT, METHOD.DELETE],
          req: {
            isManual: '@boolean', // 是否是手动填写
            grabId: '@word', // 如果是自动抓取,传递抓取卡片ID

            name: '@title(2, 5)', // 卡片名称
            image: '@url', // 卡片图片url,可能是一个相对路径
            applyUrl: '@url', // 卡片申请地址
            bank: '@word(4)', // 发卡银行
            issuer:  '@word(5)', // 发卡商

            ratesFeesUrl: '@url', // Rates & Fees URL

            'bulletPoints|3-10': [ // Bullet Points
              '@sentence(5, 10)'
            ],

            // 其他描述,至少3项会有值
            briefPoints: [
              {
                point: 'bonus',
                content: '@sentence(5, 10)'
              },
              {
                point: 'rewards',
                content: '@sentence(5, 10)'
              },
              {
                point: 'highlights',
                content: '@sentence(5, 10)'
              },
              {
                point: 'cashBack',
                content: '@sentence(5, 10)'
              },
              {
                point: 'introApr',
                content: '@sentence(5, 10)'
              },
              {
                point: 'period',
                content: '@sentence(5, 10)'
              },
              {
                point: 'annualFee',
                content: '@sentence(5, 10)'
              }
            ]
          },
          res: {
            msg: 'Create | Updated | Delete card successfully'
          }
        },
        {
          url: '/cms/credit/grabCards',
          desc: '获取所有自动抓取的卡片',
          method: METHOD.GET,
          res: {
            'items|10': [{
              name: '@title(2, 5)', // 抓取的卡片名称,
              grabId: '@word' // 抓取卡片id
            }]
          }
        },
        {
          url: '/cms/credit/grabCard/:grabId',
          desc: '获取自动抓取的卡片内容,传入抓取卡片id',
          method: METHOD.GET,
          res: {
            name: '@title(2, 5)', // 卡片名称
            lastUpdatedTime: '@datetime', // 最后抓取时间
            image: '@url', // 卡片图片
            applyUrl: '@url', // 卡片申请地址
            bank: '@word(4)', // 发卡银行
            issuer:  '@word(5)', // 发卡商

            ratesFeesUrl: '@url', // Rates & Fees URL

            'bulletPoints|3-10': [ // Bullet Points
              '@sentence(5, 10)'
            ]
          }
        },

        {
          deprecated: true,
          url: '/cms/credit/category/:category/card/:id',
          desc: '向分类中添加或删除卡片,URL传入分类名和卡片ID',
          method: [METHOD.POST, METHOD.DELETE],
          req: {
            index: '@integer(0, 200)' // 排序的位置,在POST时有用
          },
          res: {
            msg: 'Update successfully'
          }
        },

        {
          url: '/cms/credit/category/:category',
          desc: '修改分类下的列表,传入分类名',
          method: METHOD.PUT,
          req: {
            'index|30': [
              '@integer(0, 200)' // 所有卡片id,按数组排序
            ],
            'update|0-20': [
              {
                id: '@integer(10000, 99999)', // 卡片id
                highlightName: '@title(2, 5)', // 推荐文案,红色标题
                'briefPoints|3': ['@word'] // 需要展示的briefPoints名称
              }
            ],
            'insert|0-20': [
              {
                id: '@integer(10000, 99999)', // 卡片id
                highlightName: '@title(2, 5)', // 推荐文案,红色标题
                'briefPoints|3': ['@word'] // 需要展示的briefPoints名称
              }
            ],
            'remove|0-20': [
              {
                id: '@integer(10000, 99999)'
              }
            ]
          },
          res: {
            msg: 'Update category successfully'
          }
        },

        {
          url: "/cms/credit/cardDetail/:id",
          desc: "卡片详情页的获取和更新,更新才会有请求内容",
          method: [METHOD.GET, METHOD.PUT],
          req: {
            isRecommend: '@boolean', // 是否放到轮播推荐中
            highlightName: '@title(2, 5)', // 推荐文案,红色标题
            'briefPoints|3': ['@word'] // 需要展示的briefPoints名称
          },
          res:  {
            isRecommend: '@boolean', // 是否放到轮播推荐中
            highlightName: '@title(2, 5)', // 推荐文案,红色标题
            'briefPoints|3': ['@word'] // 需要展示的briefPoints名称
          }
        },

        {
          url: '/cms/credit/cardCategories/:id',
          desc: '获取卡片所属的分类,传入信用卡ID,用于在编辑的时候判断必填字断是否能被删除',
          method: METHOD.GET,
          res: {
            'category|2-5': ['@title(2, 5)']
          }
        },
        {
          url: '/cms/credit/ads',
          forward: '/credit/ads'
        },
        {
          url: '/cms/credit/ad/:id',
          desc: '获取广告详情',
          method: METHOD.GET,
          res: {
            name: '@title(2, 5)', // 广告名称,后台才能看到
            url: '@url',  // 广告链接
            image: '@image("200x200", "#50B347", "#FFF", "ADS")' // 广告图片链接
          }
        },
        {
          url: '/cms/credit/ad/:id',
          desc: '新增更新或删除广告,删除更新会传id',
          method: [METHOD.POST, METHOD.PUT, METHOD.DELETE],
          req: {
            name: '@title(2, 5)', // 广告名称,后台才能看到
            url: '@url',  // 广告链接
            image: '@url' // 广告图片链接
          },
          res: {
            msg: 'Save ad successfully'
          }
        }

      ]
    }
  ]
};
