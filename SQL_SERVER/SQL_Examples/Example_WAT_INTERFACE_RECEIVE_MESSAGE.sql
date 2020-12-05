DECLARE @OUT						INT
DECLARE @WAT_Portal_Owners_ID		INT				= 1038470									-- ez a ups azonositoja a WAT-on. Itt lehetne -1 is, ha egy altalanosan beregisztralt sofor kuldi az uzenetet az altalanosan elerheto WAT-ra.
DECLARE @WAT_Session_ID				VARCHAR(255)	= ''										-- Bevezetesre fog kerulni, mert most e nelkul a mukodes nem biztonsagos.
DECLARE @WAT_User					NVARCHAR(128)	= '0036303102211'
DECLARE @OUT_WAT_Message			NVARCHAR(MAX)
DECLARE @OUT_ErrCode				NVARCHAR(255)
DECLARE @OUT_ErrParams				NVARCHAR(MAX)

EXEC @OUT = WAT_INTERFACE_RECEIVE_MESSAGE	@WAT_Portal_Owners_ID		= @WAT_Portal_Owners_ID,
											@WAT_Session_ID				= @WAT_Session_ID,
											@WAT_User					= @WAT_User,
											@OUT_WAT_Message			= @OUT_WAT_Message		OUTPUT,
											@OUT_ErrCode				= @OUT_ErrCode			OUTPUT,
											@OUT_ErrParams				= @OUT_ErrParams		OUTPUT

SELECT @OUT EREDEMENY, @OUT_WAT_Message OUT_WAT_Message, @OUT_ErrCode OUT_ErrCode, @OUT_ErrParams OUT_ErrParams

SELECT 'WAT_Messages All', * FROM WAT_Messages	-- Itt lehet megfigyelni, hogy a letoltes lezarja a message-t. (a message Processing_Status erteke: 99)

