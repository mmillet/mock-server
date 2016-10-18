const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

module.exports = {
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
                value: 1, // 分类唯一值,对应url
                name: 'Featured-Cards',
                title: 'Featured Cards', // 分类标题
                trackId: 100,
                children: []
              },
              {
                label: 'Travel',
                value: 2,
                title: 'Travel Credit Cards', // 分类标题
                name: 'Travel',
                children: [  // 二级子分类
                  {
                    label: 'Airline',
                    title: 'Airline Credit Cards',
                    name: 'Airline',
                    value: 3,
                    trackId: 101,
                    children: []
                  },
                  {
                    label: 'Hotel',
                    title: 'Hotel Credit Cards',
                    name: 'Hotel',
                    value: 4,
                    trackId: 102,
                    children: []
                  },
                  {
                    label: 'No Foreign Transaction Fee',
                    title: 'No Foreign Transaction Fee Credit Cards',
                    name: 'Travel-No-Foreign-Transaction-Fee',
                    value: 5,
                    trackId: 103,
                    children: []
                  }
                ]
              },
              {
                label: 'Rewards',
                value: 6,
                title: 'Rewards Cards',
                name: 'Rewards',
                children: [
                  {
                    label: 'Rewards',
                    title: 'Rewards Credit Cards',
                    name: 'Rewards-Cards',
                    value: 7,
                    trackId: 104,
                    children: []
                  },
                  {
                    label: 'Cash Back',
                    title: 'Cash Back Credit Cards',
                    name: 'Cash-Back',
                    value: 8,
                    trackId: 105,
                    children: []
                  },
                  {
                    label: 'Points',
                    title: 'Points Credit Cards',
                    name: 'Points',
                    value: 9,
                    trackId: 106,
                    children: []
                  },
                  {
                    label: 'Gas',
                    title: 'Gas Credit Cards',
                    name: 'Gas',
                    value: 10,
                    trackId: 107,
                    children: []
                  }
                ]
              },
              {
                label: 'Low Fees',
                title: 'Low Fees Credit Cards',
                name: 'Low-Fees',
                value: 11,
                children: [
                  {
                    label: 'No Annual Fee',
                    title: 'No Annual Fee Credit Cards',
                    name: 'No-Annual-Fee',
                    value: 12,
                    trackId: 108,
                    children: []
                  },
                  {
                    label: 'No Foreign Transaction Fee',
                    title: 'No Foreign Transaction Fee Credit Cards',
                    name: 'Low-Fees-No-Foreign-Transaction-Fee',
                    value: 13,
                    trackId: 109,
                    children: []
                  }
                ]
              },
              {
                label: 'By Issuer',
                title: 'By Issuer Credit Cards',
                name: 'By-Issuer',
                value: -2,
                children: [
                  {
                    label: 'Visa',
                    title: 'Visa offers Credit Card Offers',
                    name: 'Visa',
                    value: 101,
                    trackId: 110,
                    children: []
                  },
                  {
                    label: 'MasterCard',
                    title: 'MasterCard Credit Card Offers',
                    name: 'MasterCard',
                    value: 102,
                    trackId: 111,
                    children: []
                  },
                  {
                    label: 'Citi',
                    title: 'Citi Credit Card Offers',
                    name: 'Citi',
                    value: 103,
                    trackId: 112,
                    children: []
                  },
                  {
                    label: 'Chase',
                    title: 'Chase Credit Card Offers',
                    name: 'Chase',
                    value: 104,
                    trackId: 113,
                    children: []
                  },
                  {
                    label: 'American Express',
                    title: 'American Express Credit Card Offers',
                    name: 'American-Express',
                    value: 105,
                    trackId: 114,
                    children: []
                  },
                  {
                    label: 'Discover',
                    title: 'Discover Credit Card Offers',
                    name: 'Discover',
                    value: 106,
                    trackId: 115,
                    children: []
                  },
                  {
                    label: 'Bank Of America',
                    title: 'Bank Of America Credit Card Offers',
                    name: 'Bank-Of-America',
                    value: 107,
                    trackId: 116,
                    children: []
                  }
                ]
              },
              {
                label: 'Small Business',
                title: 'Small Business Credit Cards',
                name: 'Small-Business',
                value: 15,
                trackId: 121,
                children: []
              },
              {
                label: 'Others',
                title: 'Other Credit Cards',
                name: 'Others',
                value: 16,
                children: [
                  {
                    label: 'Balance Transfer',
                    title: 'Balance Transfer',
                    name: 'Balance-Transfer',
                    value: 17,
                    trackId: 122,
                    children: []
                  },
                  {
                    label: '0% APR',
                    title: '0% APR',
                    name: '0-APR',
                    value: 18,
                    trackId: 123,
                    children: []
                  },
                  {
                    label: 'Low Interest',
                    title: 'Low Interest',
                    name: 'Low-Interest',
                    value: 19,
                    trackId: 124,
                    children: []
                  },
                  {
                    label: 'Bad, Limited, or No Credit History',
                    title: 'Bad, Limited, or No Credit History',
                    name: 'Bad-Limited-or-No-Credit-History',
                    value: 20,
                    trackId: 125,
                    children: []
                  },
                  {
                    label: 'Student',
                    title: 'Student Credit Cards',
                    name: 'Student',
                    value: 14,
                    trackId: 120,
                    children: []
                  }
                ]
              },
              // 最后一条是详情页分类的ID，显示的时候需要过滤掉
              {
                label: 'Detail',
                title: 'Detail',
                name: 'Detail',
                value: -1,
                trackId: 200,
                children: []
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
            'items|10': [
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
          desc: '获取分类下面的列表数据, /credit/cards/category/:分类名/page/:分页数，top参数代表要置顶的卡片ID',
          req: {
            top: "1,2,3"
          },
          res: {
            pageIndex: '@integer(0, 2)', // 当前页数,从0开始
            pageTotal: 4, // 总页数
            'items|3-10': [ // 每页数量25,前端下拉加载
              {
                image: '@image("200x100", "#50B347", "#FFF", "Credit Card")', // 信用卡图片
                applyUrl: '@pick(["http://millet.net/click-2165238-12627953", "http://track.linkoffers.net/a.aspx"])', // 申请地址
                ratesFeesUrl: '@url', // Rates & Fees URL
                highlightName: '@title(0, 6)', // 信用卡顶部红色标注的名称
                name: '@title(2, 6)', // 信用卡名称
                id: '@integer(10000, 99999)', // 信用卡ID
                bank: -3,
                issuer: -3,
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
            image: '@image("200x100", "#50B347", "#FFF", "Credit Card")', // 信用卡图片
            applyUrl: '@pick(["http://millet.net/click-2165238-12627953", "http://track.linkoffers.net/a.aspx?foid=22984460&fot=9999&foc=305"])', // 申请地址
            ratesFeesUrl: '@url', // Rates & Fees URL
            highlightName: '@title(0, 1)', // 信用卡顶部红色标注的名称
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
            keywords: '@word',
            pos: 'category|detail' // 代表分类页或详情页
          },
          res: {
            'items|0-3': [
              {
                id: '@integer(1000, 9999)', // 广告id
                name: '@title(2, 5)', // 广告名称
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
          desc: 'CMS上传图片。如果是file字段，代表是文件上传；如果是url字段，代表是从网络地址上传',
          method: METHOD.POST,
          req: {
            file: '@file',
            url: '@url' 
          },
          res: {
            image: '@image("400x400", "#50B347", "#FFF", "Image")' // 图片链接
          }
        },
        {
          url: '/cms/credit/cards/category/:category/page/:page',
          desc: 'CMS获取分类下的信用卡,如果是所有卡片category传 all',
          method: METHOD.GET,
          // status: 500,
          req: {
            keywords: '@word(5)', // 信用卡搜索
            getAll: '@boolean', // 如果为true将不分页, items字段将存放所有卡片
            getValid: '@boolean', // 只获取信息完整的卡片
            orderBy: '-cardNum|name' // 按卡片序号或name排序,如果是逆序,加-号在前面
          },
          res: {
            pageIndex: '@integer(0, 2)', // 当前页数,从0开始
            pageTotal: 3, // 总页数
            lastUpdatedTime: '@datetime()', // 最后更新时间
            'items|0-8': [ // 每页数量25,前端下拉加载
              {
                id: '@integer(10000, 99999)', // 卡片ID(序号)
                cardNum: '@integer(10000, 99999)', // 信用卡序号  
                image: '@image("200x100", "#50B347", "#FFF", "Credit Card")', // 信用卡图片
                name: '@title(2, 6)', // 信用卡名称
                expandBulletPoints: '@boolean', // 是否展开Bullet Points
                highlightName: '@title(2, 5)', // 高亮名称,推荐文案
                briefPoints: [
                  {
                    point: 'bonus',
                    enabled: true
                  },
                  {
                    point: 'rewards',
                    enabled: true
                  },
                  {
                    point: 'highlights',
                    enabled: true
                  },
                  {
                    point: 'cashBack',
                    enabled: false
                  },
                  {
                    point: 'introApr',
                    enabled: false
                  },
                  {
                    point: 'period',
                    enabled: false
                  },
                  {
                    point: 'annualFee',
                    enabled: false
                  }
                ], // 呈现在页面底部的points
                isManual: '@boolean', // 是否是手动填写的
                isActive: '@boolean', // 是否启用
                isValid: '@boolean', //  卡片信息是否完整
                isOnline: '@boolean', // 卡片是否已经上线
                isRecommend: '@boolean', // 是否在推荐栏中显示
                lastUpdatedTime: '@datetime()', // 最后更新或抓取时间
                lastDetailUpdatedTime: '@datetime()', // 详情页最后更新时间
                'categories|0-20': ['@title(1, 2)'] // 所属分类名,在展示所有卡片的时候会用到
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
            isActive: '@boolean', // 卡片是否上线
            isManual: false, // 是否是手动填写
            grabId: 123, // 如果是自动抓取,传递抓取卡片ID

            name: '@title(2, 5)', // 卡片名称
            image: '@image("200x200", "#50B347", "#FFF", "EDIT IMG")', // 卡片图片
            applyUrl: 'http://@domain', // 卡片申请地址
            bank: '@word(4)', // 发卡银行
            issuer:  '@word(5)', // 发卡商

            ratesFeesUrl:'http://@domain', // Rates & Fees URL

            'bulletPoints|3-10': [ // Bullet Points
              '@sentence(5, 10)'
            ],

            // 亮点
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
                content: '@sentence(5, 10)'
              },
              {
                point: 'period',
                content: '@sentence(5,10)'
              },
              {
                point: 'annualFee',
                content: '@sentence(5,10)'
              }
            ],

            lastUpdatedTime: '@datetime' // 单个卡片的最后更新时间
          }
        },

        

        {
          url: '/cms/credit/card/:id',
          desc: '更新|删除卡片',
          method: [METHOD.PUT, METHOD.DELETE],
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
            msg: 'Updated | Delete card successfully'
          }
        },

        {
          url: '/cms/credit/card',
          desc: '新增卡片',
          method: METHOD.POST,
          req: {
            req: '同/cms/credit/card/:id'
          },
          res: {
            msg: 'Create card successfully'
          }
        },

        {
          url: '/cms/credit/banks',
          desc: '获取所有银行',
          method: METHOD.GET,
          res: {
            'items|5-10': [{
              label: '@title(1, 2)', // 银行名称,
              value: '@integer(1000, 9999)' // 银行ID
            }]
          }
        },
        {
          url: '/cms/credit/issuers',
          desc: '获取所有发卡商',
          method: METHOD.GET,
          res: {
            'items|5-10': [{
              label: '@title(1, 2)', // 发卡商名称,
              value: '@integer(1000, 9999)' // 发卡商ID
            }]
          }
        },

        {
          url: '/cms/credit/grabCards',
          desc: '获取所有自动抓取的卡片',
          method: METHOD.GET,
          delay: 1000,
          res: {
            'items|10': [{
              name: '@title(2, 5)', // 抓取的卡片名称,
              grabId: '@integer(100000, 999999)' // 抓取卡片id
            }]
          }
        },
        {
          url: '/cms/credit/refreshGrabCards',
          desc: '更新所有的抓取卡片,如果是GET,获取最后更新时间',
          method: [METHOD.POST, METHOD.GET],
          delay: 100,
          // status: 500,
          res: {
            'lastUpdatedTime': '2016-08-08 15:72:18'
          },
          // res: 'Error!'
        },

        {
          url: '/cms/credit/grabCard/:grabId',
          desc: '获取自动抓取的卡片内容,传入抓取卡片id',
          method: METHOD.GET,
          res: {
            name: '@title(2, 5)', // 卡片名称
            lastUpdatedTime: '@datetime', // 最后抓取时间
            image: '@image("200x200", "#50B347", "#FFF", "GRABS")', // 卡片图片
            applyUrl: 'http://@domain', // 卡片申请地址
            bank: '@word(4)', // 发卡银行
            issuer:  '@word(5)', // 发卡商

            ratesFeesUrl: 'http://@domain', // Rates & Fees URL

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
          desc: '修改分类下的列表,传入分类名。回传的参数items为所有卡片数据,排序即为数组顺序。',
          method: METHOD.POST,
          req: {
            'items|0-20': [
              {
                id: '@integer(10000, 99999)', // 卡片id
                expandBulletPoints: '@boolean', // 是否展开BulletPoints
                highlightName: '@title(2, 5)', // 推荐文案,红色标题
                'briefPoints|3': ['@word'] // 需要展示的briefPoints名称
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
          method: METHOD.PUT,
          req: {
            isRecommend: '@boolean', // 是否放到轮播推荐中
            highlightName: '@title(2, 5)', // 推荐文案,红色标题
            'briefPoints|3': ['@word'] // 需要展示的briefPoints名称
          },
          res:  {
            msg: 'update successfully'
          }
        },

        {
          url: "/cms/credit/cardActive/:id",
          desc: "修改卡片上下线状态",
          method: METHOD.PUT,
          req: {
            isActive: '@boolean' //上线状态
          },
          res: {
            msg: 'update successfully'
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
            id: '@integer(1000, 9999)', // 广告id
            name: '@title(2, 5)', // 广告名称,后台才能看到
            url: '@url',  // 广告链接
            image: '@image("200x200", "#50B347", "#FFF", "ADS")' // 广告图片链接
          }
        },
        {
          url: '/cms/credit/ad',
          desc: '新增广告',
          method: [METHOD.POST],
          req: {
            pos: 'category|detail', // 分类页或详情页
            name: '@title(2, 5)', // 广告名称,后台才能看到
            url: '@url',  // 广告链接
            image: '@url' // 广告图片链接
          },
          res: {
            msg: 'Save ad successfully'
          }
        },
        {
          url: '/cms/credit/ad/:id',
          desc: '更新或删除广告',
          method: [METHOD.PUT, METHOD.DELETE],
          req: {
            pos: 'category|detail', // 分类页或详情页
            name: '@title(2, 5)', // 广告名称,后台才能看到
            url: '@url',  // 广告链接
            image: '@url' // 广告图片链接
          },
          res: {
            msg: 'Save ad successfully'
          }
        },
        {
          url: '/cms/credit/adOrder',
          desc: '设置广告排序,index数组存放新顺序的所有id',
          method: METHOD.POST,
          req: {
            pos: 'category|detail', // 分类页或详情页
            'index|1-10': ['@integer(100, 999)']
          },
          res: {
            msg: 'Update ad order successfully'
          }
        }

      ]
    }
  ]
};
