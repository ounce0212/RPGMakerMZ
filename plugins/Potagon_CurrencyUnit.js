/*:
@plugindesc
通貨単位切り替え Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_CurrencyUnit.js

@help
2つの通貨単位をプラグインコマンドで切り替えます。

プラグインコマンドで 通貨切り替え を行った場合に通貨単位が切り替わります。

■ 使用例1（景品交換所）

導入時はこちらの処理を想定しています。
イベントの実行内容を以下のように設定することで、
景品交換所を実現出来ます。

◆プラグインコマンド：Potagon_CurrencyUnit, 通貨切り替え
◆ショップの処理：ポーション
◆プラグインコマンド：Potagon_CurrencyUnit, 通貨切り替え

景品の内容はショップの処理で変更してください。
また、ショップの処理を購入のみとすることで、景品交換所らしさが出ます。

■ 使用例2（2つ目の通貨）

パラメータを以下のように変更し、
イベントの実行内容を以下のように設定することで、
円などの2つ目の世界の通貨を設定出来ます。

場所移動を設定していますが、なしでも大丈夫です。
プラグインを呼び出す時に通貨が切り替わります。

パラメータ
  購入コマンド名 購入する
  2つ目の通貨名 円

● G → 円(イベントの組み方)

◆プラグインコマンド：Potagon_CurrencyUnit, 通貨切り替え
◆場所移動：日本(0,0)

● 円 → G(イベントの組み方)

◆プラグインコマンド：Potagon_CurrencyUnit, 通貨切り替え
◆場所移動：ファンタジーの世界(0,0)

@param CurrencyUnitSwitch
@type switch
@text 通貨切り替えスイッチ
@desc ONのとき2つ目の通貨に切り替え
@default 25

@param CurrencyVariable
@type variable
@text 通貨切り替え変数
@desc 一時的に通貨を管理する変数ID
@default 30

@param BuyName
@text 購入コマンド名
@desc 2つ目の通貨の購入コマンド名
@default 交換する

@param SecondCurrencyUnitName
@text 2つ目の通貨名
@desc 2つ目の通貨名
@default 枚

@param BuyRate
@type number
@text 購入レート
@desc 購入倍率
@min 0
@decimals 5
@default 1

@param SecondBuyRate
@type number
@text 2つ目の通貨購入レート
@desc 2つ目の通貨購入倍率
@min 0
@decimals 5
@default 1

@param SellRate
@type number
@text 売却レート
@desc 売却倍率
@min 0
@decimals 5
@default 0.5

@param SecondSellRate
@type number
@text 2つ目の通貨売却レート
@desc 2つ目の通貨売却倍率
@min 0
@decimals 5
@default 0.5

@command change_currency_unit
@text 通貨切り替え
@desc 通貨単位を切り替え
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)

・Ver1.1.0(2021/1/11)
- ベースプラグイン更新対応
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const CurrencyUnitSwitchId   = Number(params.CurrencyUnitSwitchId || 25);
    const CurrencyVariableId     = Number(params.CurrencyVariableId || 30);
    const BuyName                = String(params.BuyName) || '交換する';
    const SecondCurrencyUnitName = String(params.SecondCurrencyUnitName) || '枚';
    const BuyRate                = Number(params.BuyRate || 1);
    const SecondBuyRate          = Number(params.SecondBuyRate || 1);
    const SellRate               = Number(params.SellRate || 0.5);
    const SecondSellRate         = Number(params.SecondSellRate || 0.5);

    function isSecound() {
        return $gameSwitches.value(CurrencyUnitSwitchId) === true;
    }

    // プラグインコマンド(通貨切り替え)
    PluginManager.registerCommand(plugin_name, "change_currency_unit", args => {
        let tmp = 0;
        tmp = $gameVariables.value(CurrencyVariableId);
        $gameVariables.setValue(CurrencyVariableId, $gameParty.gold());
        $gameParty.setGold(tmp);

        if(isSecound()){
            $gameSwitches.setValue(CurrencyUnitSwitchId, false);
        } else {
            $gameSwitches.setValue(CurrencyUnitSwitchId, true);
        }
    });

    // 通貨の表示切り替え
    Object.defineProperty(TextManager, 'currencyUnit', {
        get: function() {
            if (isSecound()) {
                return SecondCurrencyUnitName;
            } else {
                return $dataSystem.currencyUnit;
            }
        },
        configurable: true
    });

/**
 * パーティを扱うクラスです。所持金やアイテムなどの情報が含まれます。
 * このクラスのインスタンスは $gameParty で参照されます。
 *
 * @class
 */

/**
 * 所持金の設定
 *
 * @param {number} amount - 所持金
 */
Game_Party.prototype.setGold = function(amount) {
    this._gold = amount;
};


/**
 * ショップ画面で、購入／売却を選択するウィンドウです。
 *
 * @class
 */

/**
 * コマンドリストの作成
 */
const _Window_ShopCommand_makeCommandList = Window_ShopCommand.prototype.makeCommandList;
Window_ShopCommand.prototype.makeCommandList = function() {
    if($gameSwitches.value(CurrencyUnitSwitchId) === true){
        this.addCommand(BuyName, "buy");
        this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
        this.addCommand(TextManager.cancel, "cancel");
    } else {
        _Window_ShopCommand_makeCommandList.apply(this, arguments);
    }
};


/**
 * ショップ画面の処理を行うクラスです。
 *
 * @class
 */

/**
 * 買値の取得
 *
 * @returns {}
 */
Scene_Shop.prototype.buyingPrice = function() {
    if(isSecound()){
        return Math.floor(this._buyWindow.price(this._item) * SecondBuyRate);
    } else {
        return Math.floor(this._buyWindow.price(this._item) * BuyRate);
    }
};

/**
 * 売値の取得
 *
 * @returns {}
 */
Scene_Shop.prototype.sellingPrice = function() {
    if(isSecound()){
        return Math.floor(this._item.price * SecondSellRate);
    } else {
        return Math.floor(this._item.price * SellRate);
    }
};

})();
