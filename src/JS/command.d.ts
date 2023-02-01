import { ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface ButtonCommandExport {
	interaction: ButtonBuilder | RegExp;
	execute: (interaction: ButtonInteraction) => Promise<void>;
}

export interface SlashCommandExport {
	interaction: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface ModalCommandExport {
	interaction: ModalBuilder;
	execute: (interaction: ModalSubmitInteraction) => Promise<void>;
}

export interface CommandExport {
	slashCommands: SlashCommandExport[];
	buttonCommands: ButtonCommandExport[];
	modalCommands: ModalCommandExport[];
}