/*:
@plugindesc
トグルスイッチ Ver1.0.0

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_ToggleSwitch.js

@help
指定したスイッチのON・OFFを交互に切り替える
プラグインコマンドを提供します。

@command toggle_switch
@text トグルスイッチ
@desc 指定したスイッチのON・OFFを交互に切り替えます

@arg ToggleSwitch
@type switch
@text トグルスイッチ
@desc ON・OFFを交互に切り替えるスイッチ
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.0.0(2021/2/14)
- 公開
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();

    // プラグインコマンド(プラグインコマンド名)
    PluginManager.registerCommand(plugin_name, "toggle_switch", args => {
        const ToggleSwitch = Number(args.ToggleSwitch);
        $gameSwitches.setValue(ToggleSwitch, !$gameSwitches.value(ToggleSwitch));
    });
})();
