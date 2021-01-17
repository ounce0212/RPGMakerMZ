/*:
@plugindesc
名前ショップ Ver1.1.0

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_NameShop.js

@help
名前を指定してショップの処理を呼び出します。

@command name_shop_item
@text 名前ショップ
@desc 名前を指定してショップの処理を呼び出す

@arg goods
@type struct<GoodsList>[]
@text 商品リスト
@desc ショップの商品リスト

@arg buyOnly
@type boolean
@text 購入のみ
@desc 購入するのみにするか
@on 購入のみ
@off 購入と売却
@default false
*/

/*~struct~GoodsList:
@param name
@type string
@text 商品名
@desc 商品名(アイテム)を名前で指定

@param price
@type number
@text 価格
@desc 価格を指定。0: データベースの価格を適用
@default 0
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.0(2021/1/11)
- ベースプラグイン更新対応
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();

    // プラグインコマンド(プラグインコマンド名)
    PluginManager.registerCommand(plugin_name, "name_shop_item", args => {
        let goods = [];
        const buy_only   = Potagon.convertBool(args.buyOnly);
        if (args.goods) {
            const good_lists = JSON.parse(args.goods);
            let type, val;

            for (let i = 0; i < good_lists.length; i++) {
                let set = 0;
                let good_data = JSON.parse(good_lists[i]);
                let name = good_data.name;
                let price = good_data.price;

                // アイテム
                type = 0;
                val  = Potagon.nameSearch($dataItems, name);

                if (!val) {
                    // 武器
                    type = 1;
                    val  = Potagon.nameSearch($dataWeapons, name);
                    if (!val) {
                        // 防具
                        type = 2;
                        val  = Potagon.nameSearch($dataArmors, name);
                    }
                }

                if (val) {
                    if (price > 0) {
                    set = 1;
                    }
                    goods.push([type, val, set, price]);
                }
            }
        }

        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, buy_only);
    });
})();
