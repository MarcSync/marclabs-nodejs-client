import { Client as MarcSyncClient, Collection, Unauthorized } from "marcsync";

export class Client {

    private _marcsyncClient: MarcSyncClient;
    private _userCollection: Collection;

    constructor(acccesToken: string) {
        this._marcsyncClient = new MarcSyncClient(acccesToken);
        this._userCollection = this._marcsyncClient.getCollection("marclabs-users");
    }

    /**
     * @param userId The userId of the ROBLOX user
     * @returns The user's exp
     * @throws Unauthorized
     */
    public async getExp(userId: number): Promise<number> {
        try {
            const user = await this._userCollection.getEntries({ id: userId });
            return user[0].getValue("exp") || 0;
        } catch {
            throw new Unauthorized();
        }
    }

    /**
     * @param userId The userId of the ROBLOX user
     * @param exp The exp to set the user's exp to
     * @returns The new exp
     * @throws Unauthorized
     */
    public async setExp(userId: number, exp: number): Promise<number> {
        try {
            let user =(await this._userCollection.getEntries({ id: userId }))[0];
            if(user === undefined) {
                user = await this._userCollection.createEntry({ id: userId, exp: Math.floor(exp) });
                return Math.floor(exp);
            }
            await user.updateValue("exp", Math.floor(exp));
            return user.getValue("exp");
        } catch {
            throw new Unauthorized();
        }
    }

    /**
     * @param userId The userId of the ROBLOX user
     * @param exp The exp to add to the user
     * @returns The new exp
     * @throws Unauthorized
     */
    public async addExp(userId: number, exp: number): Promise<number> {
        try {
            let user =(await this._userCollection.getEntries({ id: userId }))[0];
            if(user === undefined) {
                user = await this._userCollection.createEntry({ id: userId, exp: Math.floor(exp) });
                return Math.floor(exp);
            }
            await user.updateValue("exp", Math.floor(user.getValue("exp") + exp));
            return user.getValue("exp");
        } catch {
            throw new Unauthorized();
        }
    }

    /**
     * @param userId The userId of the ROBLOX user
     * @param exp The exp to remove from the user
     * @returns The new exp
     * @throws Unauthorized
     */
    public async removeExp(userId: number, exp: number): Promise<number> {
        try {
            let user =(await this._userCollection.getEntries({ id: userId }))[0];
            if(user === undefined) {
                user = await this._userCollection.createEntry({ id: userId, exp: 0 });
                return 0;
            }
            let newExp = Math.floor(user.getValue("exp") - exp);
            if(newExp < 0) newExp = 0;
            await user.updateValue("exp", newExp);
            return user.getValue("exp");
        } catch {
            throw new Unauthorized();
        }
    }
}