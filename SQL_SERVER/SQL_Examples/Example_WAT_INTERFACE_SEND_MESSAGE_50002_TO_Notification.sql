DECLARE @OUT						INT
DECLARE @WAT_Portal_Owners_ID		INT				= 1038470									-- ez a ups azonositoja a WAT-on. Itt lehetne -1 is, ha egy altalanosan beregisztralt sofor kuldi az uzenetet az altalanosan elerheto WAT-ra.
DECLARE @WAT_Session_ID				VARCHAR(255)	= ''										-- Bevezetesre fog kerulni, mert most e nelkul a mukodes nem biztonsagos.
DECLARE @Message_FROM_WAT_User		NVARCHAR(128)	= '0036303102211'							-- A felado user azonositoja. Ha e-mail cim, akkor az, ha telefonszam, akkor az.
DECLARE @Message_TO_WAT_User		NVARCHAR(128)	= 'CUST_MA@upshealthcare.com'				-- A cimzett user azonositoja. Ha e-mail cim, akkor az, ha telefonszam, akkor az.
DECLARE @Message_Type				INT				= 50002										-- 50001 = TOUREXPORT
																								-- 50002 = Transport Order Statuschange Notification
																								-- 50003 = Accepting downloaded messages
DECLARE @WAT_Message				NVARCHAR(MAX)	= N'Itt lesznek a JSON-ban felsorolva a visszajelzett statuszvaltasok'
DECLARE @OUT_WAT_Messages_ID		INT
DECLARE @OUT_ErrCode				NVARCHAR(255)
DECLARE @OUT_ErrParams				NVARCHAR(MAX)

EXEC @OUT = WAT_INTERFACE_SEND_MESSAGE	@WAT_Portal_Owners_ID		= @WAT_Portal_Owners_ID,
										@WAT_Session_ID				= @WAT_Session_ID,
										@Message_FROM_WAT_User		= @Message_FROM_WAT_User,
										@Message_TO_WAT_User		= @Message_TO_WAT_User,
										@Message_Type				= @Message_Type,
										@WAT_Message				= @WAT_Message,

										@OUT_WAT_Messages_ID		= @OUT_WAT_Messages_ID		OUTPUT,
										@OUT_ErrCode				= @OUT_ErrCode				OUTPUT,
										@OUT_ErrParams				= @OUT_ErrParams			OUTPUT


SELECT @OUT EREDEMENY, @OUT_WAT_Messages_ID OUT_WAT_Messages_ID, @OUT_ErrCode OUT_ErrCode, @OUT_ErrParams OUT_ErrParams
SELECT 'WAT_Messages - uj message', * FROM WAT_Messages WHERE ID = @OUT_WAT_Messages_ID
SELECT 'WAT_Messages All', * FROM WAT_Messages	-- Itt lehet megfigyelni, hogy az 500002-es tipus NEM zarja le a korabbiakat.

