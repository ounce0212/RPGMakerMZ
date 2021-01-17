/*:
@plugindesc
デバッグ用のプラグイン Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_Debug.js

@help
開発中に便利な機能を追加します。

@param SkipPluginLoadError
@type boolean
@text プラグインロードエラースキップ
@desc ONのプラグインが存在しなくても、ゲームを起動出来るようになります
@default false
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- ヘルプ修正
- リファクタ(jshint で ES6 記法に統一)

・Ver1.1.0(2021/1/11)
- ベースプラグインを指定していなかったのを修正
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
    const SkipPluginLoadError = Potagon.convertBool(params.SkipPluginLoadError);

/**
 *
 */
if (SkipPluginLoadError) {
    PluginManager.checkErrors = function() {};
}

})();
